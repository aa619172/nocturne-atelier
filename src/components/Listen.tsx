import { tracks } from '../data/site'
import { usePlayer } from '../context/PlayerContext'
import { PlayIcon } from './PlayIcon'

export function Listen() {
  const { current, isPlaying, play } = usePlayer()

  return (
    <section id="listen" className="listen">
      <div className="section-inner section-inner--narrow">
        <div className="section-header section-header--center">
          <p className="smallcaps wine-text section-label">— Listening Room —</p>
          <h2>A votive of four</h2>
        </div>

        <div className="track-list">
          <ul>
            {tracks.map((track) => {
              const active = current?.id === track.id
              const playing = active && isPlaying

              return (
                <li
                  key={track.id}
                  className={active ? 'is-active' : ''}
                  onClick={() => play(track)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      play(track)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={playing}
                >
                  <span className="play-btn" aria-hidden="true">
                    {playing ? (
                      <span className="pause-icon">❚❚</span>
                    ) : (
                      <PlayIcon size={10} />
                    )}
                  </span>
                  <span className="font-mono gold-text">{track.num}</span>
                  <span className="track-title">{track.title}</span>
                  <span className="smallcaps muted-text">{track.duration}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <p className="smallcaps muted-text listen-note">
          Full editions ·{' '}
          <a href="#contact" className="underline-link">
            request a private cassette
          </a>
        </p>
      </div>
    </section>
  )
}
