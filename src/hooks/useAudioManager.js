import { useEffect, useRef, useState } from 'react'

export default function useAudioManager(isLoadingComplete) {
  const [isMuted, setIsMuted] = useState(false)
  const bgMusicRef = useRef(null)
  const clickSoundRef = useRef(null)

  useEffect(() => {
    // Initialize audio elements
    bgMusicRef.current = new Audio('/hub/bg-music.mp3')
    bgMusicRef.current.loop = true
    bgMusicRef.current.volume = 0.08
    bgMusicRef.current.preload = 'auto'

    clickSoundRef.current = new Audio('/hub/click-sound.wav')
    clickSoundRef.current.volume = 0.25
    clickSoundRef.current.preload = 'auto'

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause()
        bgMusicRef.current = null
      }
      if (clickSoundRef.current) {
        clickSoundRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (isLoadingComplete && bgMusicRef.current && !isMuted) {
      bgMusicRef.current.play().catch(() => {
        // Auto-play might be blocked, user will need to interact first
      })
    }
  }, [isLoadingComplete, isMuted])

  useEffect(() => {
    if (!bgMusicRef.current) return

    if (isMuted) {
      bgMusicRef.current.pause()
    } else if (isLoadingComplete) {
      bgMusicRef.current.play().catch(() => {})
    }
  }, [isMuted, isLoadingComplete])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!bgMusicRef.current) return

      if (document.hidden) {
        bgMusicRef.current.pause()
      } else if (!isMuted && isLoadingComplete) {
        bgMusicRef.current.play().catch(() => {})
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isMuted, isLoadingComplete])

  useEffect(() => {
    if (!isLoadingComplete || isMuted) return undefined

    const playBgMusic = () => {
      if (!bgMusicRef.current || !bgMusicRef.current.paused) return
      bgMusicRef.current.play().catch(() => {})
    }

    document.addEventListener('click', playBgMusic)
    document.addEventListener('keydown', playBgMusic)

    return () => {
      document.removeEventListener('click', playBgMusic)
      document.removeEventListener('keydown', playBgMusic)
    }
  }, [isMuted, isLoadingComplete])

  useEffect(() => {
    const playClickSound = () => {
      if (clickSoundRef.current && !isMuted) {
        clickSoundRef.current.currentTime = 0
        clickSoundRef.current.play().catch(() => {})
      }
    }

    const handleLinkInteraction = (e) => {
      if (!(e.target instanceof Element)) return

      const target = e.target.closest('a, button')
      if (target) {
        playClickSound()
      }
    }

    document.addEventListener('click', handleLinkInteraction)
    document.addEventListener('mouseenter', handleLinkInteraction, true)

    return () => {
      document.removeEventListener('click', handleLinkInteraction)
      document.removeEventListener('mouseenter', handleLinkInteraction, true)
    }
  }, [isMuted])

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  return { isMuted, toggleMute }
}
