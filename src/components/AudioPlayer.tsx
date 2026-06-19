import { usePlayer } from '../context/PlayerContext'

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function AudioPlayer() {
  const { current, isPlaying, progress, duration, mode, toggle, seek, stop } =
    usePlayer()

  if (!current) return null

  const elapsed = progress * duration

  return (
    <div className="audio-player" role="region" aria-label="Now playing">
      <div className="audio-player__inner">
        <div className="audio-player__info">
          <span className="smallcaps muted-text">
            {mode === 'synth' ? 'Preview · Synthesized' : 'Now Playing'}
          </span>
          <strong className="audio-player__title">{current.title}</strong>
        </div>

        <div className="audio-player__controls">
          <button type="button" className="play-btn" onClick={toggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? '❚❚' : '▶'}
          </button>
          <div className="audio-player__timeline">
            <span className="smallcaps muted-text">{formatTime(elapsed)}</span>
            <input
              type="range"
              className="audio-player__seek"
              min={0}
              max={1000}
              value={Math.round(progress * 1000)}
              onChange={(e) => seek(Number(e.target.value) / 1000)}
              aria-label="Seek"
              disabled={mode === 'synth'}
            />
            <span className="smallcaps muted-text">{formatTime(duration)}</span>
          </div>
        </div>

        <button type="button" className="audio-player__close" onClick={stop} aria-label="Close player">
          ✕
        </button>
      </div>
    </div>
  )
}
