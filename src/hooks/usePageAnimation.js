import { motion } from 'framer-motion'
import { useNavigationDirection } from './useNavigationDirection'

export function usePageAnimation() {
  const direction = useNavigationDirection()
  const distance = typeof window !== 'undefined' ? window.innerHeight : 800
  const duration = 0.65

  const variants = {
    initial: {
      opacity: 0,
      y: direction === 'forward' ? distance : -distance,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: direction === 'forward' ? -distance : distance,
      transition: {
        duration,
        ease: 'easeIn',
      },
    },
  }

  return { motion, variants }
}
