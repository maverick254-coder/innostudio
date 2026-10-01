import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useNavigationDirection } from './useNavigationDirection'

export function usePageAnimation() {
  const direction = useNavigationDirection()
  const location = useLocation()
  const distance = typeof window !== 'undefined' ? window.innerHeight : 800
  const duration = 0.65
  const isCustomProjectTransition = Boolean(location.state?.customProjectTransition)
  const isProjectRouteTransitionActive = () =>
    typeof document !== 'undefined' && document.body.classList.contains('project-route-transition-active')
  const stillVariant = {
    opacity: 1,
    y: 0,
    transition: { duration: 0 },
  }

  const variants = {
    initial: isCustomProjectTransition ? stillVariant : {
      opacity: 0,
      y: direction === 'forward' ? distance : -distance,
    },
    animate: isCustomProjectTransition ? stillVariant : {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: 'easeOut',
      },
    },
    exit: () =>
      isProjectRouteTransitionActive()
        ? stillVariant
        : {
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
