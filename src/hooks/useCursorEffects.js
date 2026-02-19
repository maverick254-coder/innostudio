import { useEffect } from 'react'
import { gsap } from 'gsap'

export default function useCursorEffects() {
  useEffect(() => {
    const cursor = document.querySelector('#cursor')
    if (!cursor) {
      return undefined
    }

    const prevWillChange = document.body.style.willChange
    document.body.style.willChange = 'transform, opacity'

    let currentState = 'default'

    const setCursorState = (state) => {
      if (state === currentState) return

      currentState = state

      if (state === 'text') {
        cursor.classList.add('enlarged')
        gsap.to(cursor, { scale: 2.7, duration: 0.22, ease: 'power2.out' })
        return
      }

      cursor.classList.remove('enlarged')

      if (state === 'small') {
        gsap.to(cursor, { scale: 0.25, duration: 0.2, ease: 'power2.out' })
        return
      }

      gsap.to(cursor, { scale: 1, duration: 0.2, ease: 'power2.out' })
    }

    const resolveHoverState = (element) => {
      if (!element) return 'default'

      if (element.closest('a, button, .logo, [role="button"], input, textarea, select, label')) {
        return 'small'
      }

      if (element.closest('h1, h2, h3, h4, h5, h6, p, li, span')) {
        return 'text'
      }

      return 'default'
    }

    const handleMove = (event) => {
      gsap.to(cursor, {
        x: event.clientX - cursor.offsetWidth / 2,
        y: event.clientY - cursor.offsetHeight / 2,
        duration: 0.1,
        ease: 'elastic.out',
      })

      const hoveredElement = document.elementFromPoint(event.clientX, event.clientY)
      setCursorState(resolveHoverState(hoveredElement))
    }

    const handleWindowLeave = () => {
      setCursorState('default')
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseleave', handleWindowLeave)

    return () => {
      document.body.style.willChange = prevWillChange
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', handleWindowLeave)
      gsap.killTweensOf(cursor)
    }
  }, [])
}
