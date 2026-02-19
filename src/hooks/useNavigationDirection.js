import { useContext } from 'react'
import { NavigationDirectionContext } from './NavigationDirectionContext.jsx'

export function useNavigationDirection() {
  return useContext(NavigationDirectionContext)
}
