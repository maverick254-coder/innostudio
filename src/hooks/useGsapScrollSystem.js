import { useEffect } from 'react'
import gsap from 'gsap'
import Lenis from 'lenis'

export default function useGsapScrollSystem(routeKey) {
  useEffect(() => {
    const scroller = document.querySelector('.page-transition')
    const pageRoot = document.querySelector('#page-content')

    if (!scroller || !pageRoot) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let lenis = null
    let lenisTicker = null

    if (!reduceMotion) {
      lenis = new Lenis({
        wrapper: scroller,
        content: pageRoot,
        duration: 1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1,
      })

      lenisTicker = (time) => {
        lenis.raf(time * 1000)
      }

      gsap.ticker.add(lenisTicker)
      gsap.ticker.lagSmoothing(0)
    }

    return () => {
      if (lenisTicker) {
        gsap.ticker.remove(lenisTicker)
      }

      if (lenis) {
        lenis.destroy()
      }
    }
  }, [routeKey])
}
