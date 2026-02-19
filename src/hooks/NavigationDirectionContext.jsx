import { createContext, useMemo, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const PAGE_ORDER = ['/', '/about', '/works', '/toolstack', '/contact']

export const NavigationDirectionContext = createContext('forward')

export function NavigationDirectionProvider({ children }) {
  const location = useLocation()
  const prevPathRef = useRef(location.pathname)

  const direction = useMemo(() => {
    const currentIndex = PAGE_ORDER.indexOf(location.pathname)
    const prevIndex = PAGE_ORDER.indexOf(prevPathRef.current)

    if (currentIndex !== -1 && prevIndex !== -1 && currentIndex !== prevIndex) {
      return currentIndex > prevIndex ? 'forward' : 'backward'
    }

    return 'forward'
  }, [location.pathname])

  useEffect(() => {
    prevPathRef.current = location.pathname
  }, [location.pathname])

  return (
    <NavigationDirectionContext.Provider value={direction}>
      {children}
    </NavigationDirectionContext.Provider>
  )
}
