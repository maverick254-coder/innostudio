import { useEffect } from 'react'
import { gsap } from 'gsap'

const MAX_MAGNETIC_DISTANCE = 14

function canUseMagneticMotion() {
  const hasFinePointer = window.matchMedia?.('(pointer: fine)').matches ?? true
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  return hasFinePointer && !reduceMotion
}

export default function useMagneticButton(ref) {
  useEffect(() => {
    const element = ref.current
    if (!element || !canUseMagneticMotion()) return undefined

    const moveButton = (event) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const x = ((event.clientX - centerX) / rect.width) * MAX_MAGNETIC_DISTANCE
      const y = ((event.clientY - centerY) / rect.height) * MAX_MAGNETIC_DISTANCE

      gsap.to(element, {
        '--magnetic-x': `${x.toFixed(2)}px`,
        '--magnetic-y': `${y.toFixed(2)}px`,
        duration: 0.28,
        ease: 'power3.out',
        overwrite: true,
      })
    }

    const resetButton = () => {
      gsap.to(element, {
        '--magnetic-x': '0px',
        '--magnetic-y': '0px',
        duration: 0.38,
        ease: 'power3.out',
        overwrite: true,
      })
    }

    element.addEventListener('pointermove', moveButton)
    element.addEventListener('pointerleave', resetButton)

    return () => {
      element.removeEventListener('pointermove', moveButton)
      element.removeEventListener('pointerleave', resetButton)
      gsap.killTweensOf(element)
      element.style.removeProperty('--magnetic-x')
      element.style.removeProperty('--magnetic-y')
    }
  }, [ref])
}
