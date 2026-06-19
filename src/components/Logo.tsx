type LogoProps = {
  className?: string
  width?: number
  height?: number
  alt?: string
}

export function Logo({ className, width, height, alt = '' }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="eager"
      decoding="async"
    />
  )
}
