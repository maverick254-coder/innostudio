import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useNavigationDirection } from './useNavigationDirection'

export function usePageTransition(contentRef) {
  const direction = useNavigationDirection()
  const firstRenderRef = useRef(true)

  useEffect(() => {
    if (!contentRef?.current) return

    // Skip animation on first render
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    const element = contentRef.current
    // Content appears to come completely from bottom/top
    const startY = direction === 'forward' ? window.innerHeight : -window.innerHeight

    // Slow, stylish fade + slide animation
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: startY,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: 'power3.out',
      }
    )
  }, [direction])
}



