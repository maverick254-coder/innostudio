import { useEffect, useState } from 'react'

const NORMAL_LOADER_DURATION = 2350
const REDUCED_LOADER_DURATION = 760

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

function SiteLoader({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isReducedMotion] = useState(() => prefersReducedMotion())

  useEffect(() => {
    const duration = isReducedMotion ? REDUCED_LOADER_DURATION : NORMAL_LOADER_DURATION

    document.body.classList.add('site-loader-active', 'no-scroll')

    const completeTimer = window.setTimeout(() => {
      setIsVisible(false)
      document.body.classList.remove('site-loader-active', 'no-scroll')
      onComplete?.()
    }, duration)

    return () => {
      window.clearTimeout(completeTimer)
      document.body.classList.remove('site-loader-active', 'no-scroll')
    }
  }, [isReducedMotion, onComplete])

  if (!isVisible) return null

  return (
    <div
      className={`site-loader${isReducedMotion ? ' site-loader--reduced-motion' : ''}`}
      role="status"
      aria-label="Loading Inno'studio"
    >
      <div className="site-loader-mark" aria-hidden="true">
        <img className="site-loader-mark__ghost" src="/favicon.svg" alt="" />
        <img className="site-loader-mark__fill" src="/favicon.svg" alt="" />
      </div>
    </div>
  )
}

export default SiteLoader
