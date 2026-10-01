import { useEffect } from 'react'
import gsap from 'gsap'
import Lenis from 'lenis'

export default function useGsapScrollSystem(routeKey) {
  useEffect(() => {
    let lenis = null
    let lenisTicker = null
    let frameId = null
    let initAttempts = 0

    const initLenis = () => {
      const scroller = document.querySelector('.page-transition')
      const pageRoot = document.querySelector('#page-content')

      if (!scroller || !pageRoot) {
        if (initAttempts < 8) {
          initAttempts += 1
          frameId = requestAnimationFrame(initLenis)
        }
        return
      }

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduceMotion) {
        scroller.classList.remove('lenis', 'lenis-smooth')
        return
      }

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
      window.__innostudioLenis = lenis
    }

    frameId = requestAnimationFrame(initLenis)

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }

      if (lenisTicker) {
        gsap.ticker.remove(lenisTicker)
      }

      if (lenis) {
        const scroller = document.querySelector('.page-transition')
        if (window.__innostudioLenis === lenis) {
          delete window.__innostudioLenis
        }
        scroller?.classList.remove('lenis', 'lenis-smooth')
        lenis.destroy()
      }
    }
  }, [routeKey])
}
