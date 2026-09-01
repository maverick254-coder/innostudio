import { NavLink, useLocation, useOutlet } from 'react-router-dom'
import { cloneElement, useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { NavigationDirectionProvider } from '../hooks/NavigationDirectionContext.jsx'
import useCursorEffects from '../hooks/useCursorEffects.js'
import useAudioManager from '../hooks/useAudioManager.js'
import useScrollbarIndicator from '../hooks/useScrollbarIndicator.js'
import useGsapScrollSystem from '../hooks/useGsapScrollSystem.js'

function Layout() {
  const location = useLocation()
  const outlet = useOutlet()
  const [isLoadingComplete, setIsLoadingComplete] = useState(() => location.pathname !== '/')
  const { isMuted, toggleMute } = useAudioManager(isLoadingComplete)

  useCursorEffects()
  useScrollbarIndicator()
  useGsapScrollSystem(location.pathname)

  const handleExitComplete = () => {
    const scrollContainer = document.querySelector('.page-transition')
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'auto' })
    }
  }

  // Handle scrollbar loading animation on page navigation
  useEffect(() => {
    // Start loading animation when navigating to a new page
    if (typeof window !== 'undefined' && window.startScrollbarLoadingAnimation) {
      window.startScrollbarLoadingAnimation()

      // Stop animation after page transition completes (0.65s + buffer)
      const timeoutId = setTimeout(() => {
        if (window.stopScrollbarLoadingAnimation) {
          window.stopScrollbarLoadingAnimation()
        }
      }, 750)

      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [location.pathname])

  // Expose loading state setter to children via context or window
  useEffect(() => {
    if (typeof window === 'undefined' || window.setAudioLoadingComplete) return undefined

    window.setAudioLoadingComplete = () => setIsLoadingComplete(true)

    return () => {
      if (window.setAudioLoadingComplete) {
        delete window.setAudioLoadingComplete
      }
    }
  }, [])

  return (
    <>
      <video autoPlay loop muted playsInline id="bg-video">
        <source src="/hub/Black_Gradient.webm" type="video/webm" />
      </video>

      <div id="cursor"></div>

      <aside className="sidebar">
        <div className="scrollbar-thumb"></div>
        <NavLink to="/" className="logo" aria-label="Inno'studio home">
          <svg width="348" height="39" viewBox="0 0 348 39" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text
              fill="url(#paint0_linear_2_11)"
              xmlSpace="preserve"
              style={{ whiteSpace: 'pre' }}
              fontFamily="Inter"
              fontSize="48"
              letterSpacing="-4px"
              shapeRendering="geometricPrecision"
            >
              <tspan x="-2.5" y="37.4545">I</tspan>
              <tspan x="131.547" y="37.4545"> S</tspan>
            </text>

            <text
              fill="black"
              xmlSpace="preserve"
              style={{ whiteSpace: 'pre' }}
              fontFamily="Inter"
              fontSize="48"
              letterSpacing="-4px"
              shapeRendering="geometricPrecision"
            >
              <tspan x="-12" y="37.4545"> </tspan>
              <tspan x="6.20312" y="37.4545"> N N O</tspan>
              <tspan x="167.656" y="37.4545"> T U D I O &#10;</tspan>
            </text>

            <text
              fill="black"
              xmlSpace="preserve"
              style={{ whiteSpace: 'pre' }}
              fontFamily="Inter"
              fontSize="48"
              fontWeight="900"
              letterSpacing="-4px"
              shapeRendering="geometricPrecision"
            >
              <tspan x="-12" y="-20.5455">&#10;</tspan>
            </text>

            <text
              stroke="url(#paint1_linear_2_11)"
              xmlSpace="preserve"
              style={{ whiteSpace: 'pre' }}
              fontFamily="Inter"
              fontSize="48"
              letterSpacing="-4px"
              shapeRendering="geometricPrecision"
            >
              <tspan x="-2.5" y="37.4545">I</tspan>
              <tspan x="131.547" y="37.4545"> S</tspan>
            </text>

            <text
              stroke="url(#paint2_linear_2_11)"
              xmlSpace="preserve"
              style={{ whiteSpace: 'pre' }}
              fontFamily="Inter"
              fontSize="48"
              letterSpacing="-4px"
              shapeRendering="geometricPrecision"
            >
              <tspan x="-12" y="37.4545"> </tspan>
              <tspan x="6.20312" y="37.4545"> N N O</tspan>
              <tspan x="167.656" y="37.4545"> T U D I O &#10;</tspan>
            </text>

            <text
              stroke="url(#paint3_linear_2_11)"
              xmlSpace="preserve"
              style={{ whiteSpace: 'pre' }}
              fontFamily="Inter"
              fontSize="48"
              fontWeight="900"
              letterSpacing="-4px"
              shapeRendering="geometricPrecision"
            >
              <tspan x="-12" y="-20.5455">&#10;</tspan>
            </text>

            <defs>
              <linearGradient id="paint0_linear_2_11" x1="-12" y1="-66.5" x2="355" y2="-66.5" gradientUnits="userSpaceOnUse">
                <stop offset="0.9997" stopColor="white" />
                <stop offset="0.9998" stopColor="white" />
                <stop offset="0.9999" stopColor="white" />
                <stop offset="1" stopColor="#999999" />
              </linearGradient>
              <linearGradient id="paint1_linear_2_11" x1="-12" y1="-66.5" x2="355" y2="-66.5" gradientUnits="userSpaceOnUse">
                <stop offset="0.9997" stopColor="white" />
                <stop offset="0.9998" stopColor="white" />
                <stop offset="0.9999" stopColor="white" />
                <stop offset="1" stopColor="#999999" />
              </linearGradient>
              <linearGradient id="paint2_linear_2_11" x1="-12" y1="-66.5" x2="355" y2="-66.5" gradientUnits="userSpaceOnUse">
                <stop offset="0.9997" stopColor="white" />
                <stop offset="0.9998" stopColor="white" />
                <stop offset="0.9999" stopColor="white" />
                <stop offset="1" stopColor="#999999" />
              </linearGradient>
              <linearGradient id="paint3_linear_2_11" x1="-12" y1="-66.5" x2="355" y2="-66.5" gradientUnits="userSpaceOnUse">
                <stop offset="0.9997" stopColor="white" />
                <stop offset="0.9998" stopColor="white" />
                <stop offset="0.9999" stopColor="white" />
                <stop offset="1" stopColor="#999999" />
              </linearGradient>
            </defs>
          </svg>
          <h1>Creative Developer</h1>
        </NavLink>

        <nav className="desktop-nav">
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>About</NavLink>
          <NavLink to="/works" className={({ isActive }) => (isActive ? 'active' : '')}>Work</NavLink>
          <NavLink to="/toolstack" className={({ isActive }) => (isActive ? 'active' : '')}>Toolstack</NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>Contact</NavLink>
        </nav>

        <div className="sidebar-footer">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=innocentnyalik@gmail.com"
            target="_blank"
            rel="noreferrer"
          >
            Email
          </a>
          <span className="separator">·</span>
          <a href="https://www.linkedin.com/in/innocent-nyalik-0002b9390" target="_blank" rel="noreferrer">LinkedIn</a>
          <span className="separator">·</span>
          <a href="https://www.fiverr.com/s/o8r5qk4" target="_blank" rel="noreferrer">Fiverr</a>
          <span className="separator">·</span>
          <a href="https://github.com/maverick254-coder" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </aside>

      <button 
        className="sound-toggle" 
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      >
        <div className={`sound-wave ${!isMuted ? 'active' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <NavigationDirectionProvider>
        <div className="page-transition">
          <AnimatePresence mode="wait" initial={false} onExitComplete={handleExitComplete}>
            {outlet ? cloneElement(outlet, { key: location.pathname }) : null}
          </AnimatePresence>
        </div>
      </NavigationDirectionProvider>
    </>
  )
}

export default Layout
