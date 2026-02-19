import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useScrollbarIndicator() {
  const loadingAnimationRef = useRef(null)
  const isLoadingRef = useRef(false)

  useEffect(() => {
    const spreadDistance = 22 // gradient spread radius

    const updateScrollbar = () => {
      // Only update from scroll if not loading
      if (isLoadingRef.current) return

      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop

      // Calculate scrollbar thumb position as percentage of total document height
      const maxScroll = documentHeight - windowHeight
      const thumbPosPercent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0

      // Calculate color stop positions for the gradient
      const fadeStartPos = Math.max(0, thumbPosPercent - spreadDistance)
      const purpleCenterPos = thumbPosPercent
      const fadeEndPos = Math.min(100, thumbPosPercent + spreadDistance)

      // Update CSS variables for gradient color stops
      document.documentElement.style.setProperty('--fade-start', `${fadeStartPos}%`)
      document.documentElement.style.setProperty('--purple-center', `${purpleCenterPos}%`)
      document.documentElement.style.setProperty('--fade-end', `${fadeEndPos}%`)
    }

    const startLoadingAnimation = () => {
      isLoadingRef.current = true

      // Kill any existing animation
      if (loadingAnimationRef.current) {
        loadingAnimationRef.current.kill()
      }

      // Create a proxy object for animating the thumb position
      const animationState = { thumbPos: 0 }

      // Animate the thumb up and down continuously during loading
      loadingAnimationRef.current = gsap.timeline({ repeat: -1 })
        .to(
          animationState,
          {
            thumbPos: 100,
            duration: 2,
            ease: 'sine.inOut',
            onUpdate: () => {
              const thumbPosPercent = animationState.thumbPos
              const fadeStartPos = Math.max(0, thumbPosPercent - spreadDistance)
              const fadeEndPos = Math.min(100, thumbPosPercent + spreadDistance)

              document.documentElement.style.setProperty('--fade-start', `${fadeStartPos}%`)
              document.documentElement.style.setProperty('--purple-center', `${thumbPosPercent}%`)
              document.documentElement.style.setProperty('--fade-end', `${fadeEndPos}%`)
            },
          }
        )
        .to(
          animationState,
          {
            thumbPos: 0,
            duration: 2,
            ease: 'sine.inOut',
            onUpdate: () => {
              const thumbPosPercent = animationState.thumbPos
              const fadeStartPos = Math.max(0, thumbPosPercent - spreadDistance)
              const fadeEndPos = Math.min(100, thumbPosPercent + spreadDistance)

              document.documentElement.style.setProperty('--fade-start', `${fadeStartPos}%`)
              document.documentElement.style.setProperty('--purple-center', `${thumbPosPercent}%`)
              document.documentElement.style.setProperty('--fade-end', `${fadeEndPos}%`)
            },
          }
        )
    }

    const stopLoadingAnimation = () => {
      isLoadingRef.current = false

      if (loadingAnimationRef.current) {
        loadingAnimationRef.current.kill()
        loadingAnimationRef.current = null
      }

      // Immediately update to scroll position
      updateScrollbar()
    }

    // Expose functions globally for page navigation triggers
    if (typeof window !== 'undefined') {
      window.startScrollbarLoadingAnimation = startLoadingAnimation
      window.stopScrollbarLoadingAnimation = stopLoadingAnimation
    }

    // Set initial scroll position
    updateScrollbar()

    // Update on scroll with smooth tracking
    window.addEventListener('scroll', updateScrollbar, { passive: true })

    // Update on resize
    window.addEventListener('resize', updateScrollbar)

    return () => {
      window.removeEventListener('scroll', updateScrollbar)
      window.removeEventListener('resize', updateScrollbar)

      if (loadingAnimationRef.current) {
        loadingAnimationRef.current.kill()
      }
    }
  }, [])
}

export default useScrollbarIndicator
