import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Release } from '../data/site'
import { synthPresets } from '../data/site'

type PlayerMode = 'idle' | 'file' | 'synth'

type PlayerContextValue = {
  current: Release | null
  isPlaying: boolean
  progress: number
  duration: number
  mode: PlayerMode
  play: (track: Release) => void
  toggle: () => void
  pause: () => void
  stop: () => void
  seek: (ratio: number) => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)
const SYNTH_PREVIEW_SECONDS = 90

function createSynthEngine(releaseId: string, ctx: AudioContext) {
  const preset = synthPresets[releaseId] ?? synthPresets['vesper-procession']
  const master = ctx.createGain()
  master.gain.value = 0.22
  master.connect(ctx.destination)

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = preset.filterFreq
  filter.Q.value = 2
  filter.connect(master)

  const lfo = ctx.createOscillator()
  lfo.frequency.value = preset.lfoRate
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = preset.filterFreq * 0.4
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)
  lfo.start()

  const oscA = ctx.createOscillator()
  oscA.type = 'sine'
  oscA.frequency.value = preset.baseFreq

  const oscB = ctx.createOscillator()
  oscB.type = 'triangle'
  oscB.frequency.value = preset.baseFreq * (1 + preset.detune)
  oscB.detune.value = -7

  const oscGain = ctx.createGain()
  oscGain.gain.value = 0.5
  oscA.connect(oscGain)
  oscB.connect(oscGain)
  oscGain.connect(filter)

  oscA.start()
  oscB.start()

  return {
    stop: () => {
      oscA.stop()
      oscB.stop()
      lfo.stop()
      master.disconnect()
    },
    duration: SYNTH_PREVIEW_SECONDS,
  }
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const synthRef = useRef<{ stop: () => void; duration: number } | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const synthStartRef = useRef(0)
  const synthRafRef = useRef(0)

  const [current, setCurrent] = useState<Release | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [mode, setMode] = useState<PlayerMode>('idle')

  const stopSynth = useCallback(() => {
    cancelAnimationFrame(synthRafRef.current)
    synthRef.current?.stop()
    synthRef.current = null
  }, [])

  const stopAll = useCallback(() => {
    stopSynth()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    setIsPlaying(false)
    setProgress(0)
  }, [stopSynth])

  const tickSynth = useCallback(() => {
    if (!synthRef.current) return
    const elapsed = (performance.now() - synthStartRef.current) / 1000
    const dur = synthRef.current.duration
    setProgress(Math.min(elapsed / dur, 1))
    if (elapsed >= dur) {
      stopSynth()
      setIsPlaying(false)
      setProgress(0)
      return
    }
    synthRafRef.current = requestAnimationFrame(tickSynth)
  }, [stopSynth])

  const startSynth = useCallback(
    (track: Release) => {
      stopAll()
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext()
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') void ctx.resume()

      synthRef.current = createSynthEngine(track.id, ctx)
      setMode('synth')
      setDuration(synthRef.current.duration)
      setCurrent(track)
      setIsPlaying(true)
      synthStartRef.current = performance.now()
      synthRafRef.current = requestAnimationFrame(tickSynth)
    },
    [stopAll, tickSynth],
  )

  const startFile = useCallback(
    (track: Release) => {
      stopAll()
      if (!audioRef.current) {
        audioRef.current = new Audio()
        audioRef.current.preload = 'metadata'
      }
      const audio = audioRef.current
      audio.src = track.previewSrc

      const onLoaded = () => {
        setDuration(audio.duration || 0)
        setMode('file')
        setCurrent(track)
        void audio.play().then(() => setIsPlaying(true))
      }

      const onError = () => {
        audio.removeEventListener('loadedmetadata', onLoaded)
        startSynth(track)
      }

      audio.addEventListener('loadedmetadata', onLoaded, { once: true })
      audio.addEventListener('error', onError, { once: true })
      audio.load()
    },
    [stopAll, startSynth],
  )

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration)
    }
    const onEnded = () => {
      setIsPlaying(false)
      setProgress(0)
    }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnded)
    }
  }, [mode])

  useEffect(() => () => stopAll(), [stopAll])

  const play = useCallback(
    (track: Release) => {
      if (current?.id === track.id) {
        if (isPlaying) {
          if (mode === 'file' && audioRef.current) audioRef.current.pause()
          else stopSynth()
          setIsPlaying(false)
        } else {
          if (mode === 'file' && audioRef.current) {
            void audioRef.current.play().then(() => setIsPlaying(true))
          } else if (mode === 'synth') {
            startSynth(track)
          }
        }
        return
      }
      startFile(track)
    },
    [current, isPlaying, mode, startFile, startSynth, stopSynth],
  )

  const toggle = useCallback(() => {
    if (!current) return
    play(current)
  }, [current, play])

  const stop = useCallback(() => {
    stopAll()
    setCurrent(null)
    setMode('idle')
    setDuration(0)
  }, [stopAll])

  const pause = useCallback(() => {
    if (mode === 'file' && audioRef.current) audioRef.current.pause()
    else stopSynth()
    setIsPlaying(false)
  }, [mode, stopSynth])

  const seek = useCallback(
    (ratio: number) => {
      const clamped = Math.max(0, Math.min(1, ratio))
      if (mode === 'file' && audioRef.current?.duration) {
        audioRef.current.currentTime = clamped * audioRef.current.duration
        setProgress(clamped)
      }
    },
    [mode],
  )

  return (
    <PlayerContext.Provider
      value={{ current, isPlaying, progress, duration, mode, play, toggle, pause, stop, seek }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}
