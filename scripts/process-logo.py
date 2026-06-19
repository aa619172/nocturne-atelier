"""Remove logo background (dark square, white specks) via edge flood-fill."""
from PIL import Image
import sys
from collections import deque


def is_background(r: int, g: int, b: int, a: int) -> bool:
    if a < 10:
        return True

    # Pure/near black matte
    if max(r, g, b) < 52:
        return True

    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    max_c = max(r, g, b)
    min_c = min(r, g, b)
    sat = (max_c - min_c) / max_c if max_c else 0

    # White / light specks
    if r > 228 and g > 228 and b > 228:
        return True
    if lum > 205 and sat < 0.18:
        return True

    # Dark charcoal matte (incl. gray fringe around black square)
    if lum < 88 and sat < 0.55:
        return True

    return False


def flood_transparent(img: Image.Image) -> None:
    w, h = img.size
    px = img.load()
    visited = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def try_seed(x: int, y: int) -> None:
        if 0 <= x < w and 0 <= y < h and not visited[y][x]:
            r, g, b, a = px[x, y]
            if is_background(r, g, b, a):
                visited[y][x] = True
                q.append((x, y))

    for x in range(w):
        try_seed(x, 0)
        try_seed(x, h - 1)
    for y in range(h):
        try_seed(0, y)
        try_seed(w - 1, y)

    while q:
        x, y = q.popleft()
        px[x, y] = (0, 0, 0, 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
                r, g, b, a = px[nx, ny]
                if is_background(r, g, b, a):
                    visited[ny][nx] = True
                    q.append((nx, ny))


def _count_opaque_neighbors(px, w: int, h: int, x: int, y: int, radius: int = 1) -> int:
    count = 0
    for nx in range(max(0, x - radius), min(w, x + radius + 1)):
        for ny in range(max(0, y - radius), min(h, y + radius + 1)):
            if nx == x and ny == y:
                continue
            if px[nx, ny][3] > 20:
                count += 1
    return count


def remove_isolated_pixels(img: Image.Image) -> None:
    """Remove single-pixel dust with no adjacent opaque pixels."""
    w, h = img.size
    px = img.load()
    to_clear: list[tuple[int, int]] = []

    for y in range(h):
        for x in range(w):
            if px[x, y][3] < 20:
                continue
            if _count_opaque_neighbors(px, w, h, x, y, radius=1) == 0:
                to_clear.append((x, y))

    for x, y in to_clear:
        px[x, y] = (0, 0, 0, 0)


def remove_isolated_specks(img: Image.Image, min_neighbors: int = 2) -> None:
    """Remove tiny bright islands not connected to main artwork."""
    w, h = img.size
    px = img.load()
    to_clear: list[tuple[int, int]] = []

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 20:
                continue
            lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
            max_c = max(r, g, b)
            min_c = min(r, g, b)
            sat = (max_c - min_c) / max_c if max_c else 0

            # Bright gold fringe or gray/white specks with few neighbors
            is_speck = lum >= 180 or (lum >= 115 and sat < 0.12)
            if not is_speck:
                continue

            if _count_opaque_neighbors(px, w, h, x, y, radius=2) <= min_neighbors:
                to_clear.append((x, y))

    for x, y in to_clear:
        px[x, y] = (0, 0, 0, 0)


def remove_fringe_islands(img: Image.Image, max_size: int = 280) -> None:
    """Remove small disconnected islands in outer margins (background residue)."""
    w, h = img.size
    px = img.load()
    visited: set[tuple[int, int]] = set()
    to_clear: list[tuple[int, int]] = []

    def bfs(sx: int, sy: int) -> list[tuple[int, int]]:
        q: deque[tuple[int, int]] = deque([(sx, sy)])
        comp: list[tuple[int, int]] = []
        visited.add((sx, sy))
        while q:
            x, y = q.popleft()
            comp.append((x, y))
            for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited and px[nx, ny][3] > 20:
                    visited.add((nx, ny))
                    q.append((nx, ny))
        return comp

    right_edge = int(w * 0.92)
    bottom_edge = int(h * 0.88)

    for sy in range(h):
        for sx in range(w):
            if (sx, sy) in visited or px[sx, sy][3] < 20:
                continue
            comp = bfs(sx, sy)
            if len(comp) > max_size:
                continue
            xs = [p[0] for p in comp]
            ys = [p[1] for p in comp]
            in_margin = min(xs) >= right_edge or (
                min(ys) >= bottom_edge and min(xs) >= int(w * 0.85)
            )
            if in_margin:
                to_clear.extend(comp)

    for x, y in to_clear:
        px[x, y] = (0, 0, 0, 0)


def crop_to_content(img: Image.Image, pad: int = 2) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(img.size[0], x1 + pad)
    y1 = min(img.size[1], y1 + pad)
    return img.crop((x0, y0, x1, y1))


def strip_background(src: str, dst: str) -> None:
    img = Image.open(src).convert('RGBA')
    flood_transparent(img)
    remove_fringe_islands(img)
    remove_isolated_pixels(img)
    remove_isolated_specks(img)
    remove_isolated_pixels(img)
    img = crop_to_content(img)
    img.save(dst)
    print(f'Saved transparent logo to {dst} ({img.size[0]}x{img.size[1]})')


if __name__ == '__main__':
    source = sys.argv[1] if len(sys.argv) > 1 else 'public/logo.png'
    target = sys.argv[2] if len(sys.argv) > 2 else source
    strip_background(source, target)
