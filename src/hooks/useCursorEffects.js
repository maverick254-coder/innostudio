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
        cursor.classList.remove('project-action')
        cursor.classList.add('enlarged')
        gsap.to(cursor, { scale: 2.7, duration: 0.22, ease: 'power2.out' })
        return
      }

      cursor.classList.remove('enlarged')
      cursor.classList.remove('project-action')

      if (state === 'project') {
        cursor.classList.add('project-action')
        gsap.to(cursor, { scale: 2.45, duration: 0.24, ease: 'power2.out' })
        return
      }

      if (state === 'small') {
        gsap.to(cursor, { scale: 0.25, duration: 0.2, ease: 'power2.out' })
        return
      }

      gsap.to(cursor, { scale: 1, duration: 0.2, ease: 'power2.out' })
    }

    const resolveHoverState = (element) => {
      if (!element) return 'default'

      const hasFinePointer = window.matchMedia?.('(pointer: fine)').matches ?? true

      if (hasFinePointer && element.closest('.project-media-interactive, .project-external-link')) {
        return 'project'
      }

      if (
        element.closest(
          'a, button, .logo, [role="button"], input, textarea, select, label, .works-project-card, .works-project-title, .works-project-media, .works-project-image'
        )
      ) {
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
