import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'Hello!',
    text: "I'm a freelancer Creative Developer, crafting innovative digital experiences and exploring new technologies.",
  },
  {
    title: 'Hi There!',
    text: 'I specialize in front-end and back-end development, bringing ideas to life with clean and efficient code.',
  },
  {
    title: 'Hey!',
    text: 'I am passionate about creating immersive web experiences and pushing the limits of modern web technologies.',
  },
]

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(() => {
    const navEntry = performance.getEntriesByType('navigation')[0]
    const isReload = navEntry?.type === 'reload'
    return !sessionStorage.getItem('firstVisitDone') || isReload
  })
  const containerRefs = useRef([])
  const typingTimers = useRef([])
  const isRotatingRef = useRef(false)
  const hasStartedTypewriterRef = useRef(false)

  const startTypewriter = (container) => {
    if (!container) return

    typingTimers.current.forEach((timer) => clearTimeout(timer))
    typingTimers.current = []

    const lines = container.querySelectorAll('.small-line')
    lines.forEach((line) => {
      const fullText = line.dataset.text || ''
      const textSpan = line.querySelector('.typing-text')
      if (!textSpan) return
      textSpan.classList.add('is-typing')
      
      // Wrap each character in a span
      textSpan.innerHTML = fullText
        .split('')
        .map((char) => `<span class="char" style="opacity: 0">${char === ' ' ? '&nbsp;' : char}</span>`)
        .join('')
      
      const chars = textSpan.querySelectorAll('.char')
      let index = 0
      
      const revealNext = () => {
        if (index < chars.length) {
          chars[index].style.opacity = '1'
          index += 1
          typingTimers.current.push(setTimeout(revealNext, 18))
        }
      }
      revealNext()
    })
  }

  useEffect(() => {
    if (!isLoading) return undefined

    const totalAnimationTime = 5000
    document.body.classList.add('no-scroll', 'is-loading')

    const hideTimer = setTimeout(() => {
      setIsLoading(false)
      sessionStorage.setItem('firstVisitDone', 'true')
      document.body.classList.remove('no-scroll', 'is-loading')
      if (window.setAudioLoadingComplete) {
        window.setAudioLoadingComplete()
      }
      const container = containerRefs.current[currentIndex]
      if (container) {
        setTimeout(() => {
          startTypewriter(container)
          hasStartedTypewriterRef.current = true
        }, 0)
      }
    }, totalAnimationTime)

    return () => {
      clearTimeout(hideTimer)
      document.body.classList.remove('no-scroll', 'is-loading')
    }
  }, [isLoading])

  useLayoutEffect(() => {
    if (isLoading) return
    const currentContainer = containerRefs.current[currentIndex]
    if (!currentContainer) return

    if (isRotatingRef.current) {
      gsap.set(currentContainer, { opacity: 0, y: -12 })
      gsap.fromTo(
        currentContainer,
        { opacity: 0, y: -12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          onStart: () => startTypewriter(currentContainer),
          onComplete: () => {
            isRotatingRef.current = false
          },
        },
      )
      return
    }

    if (hasStartedTypewriterRef.current) {
      hasStartedTypewriterRef.current = false
      return
    }

    startTypewriter(currentContainer)
  }, [currentIndex, isLoading])

  const handleRefresh = () => {
    const currentContainer = containerRefs.current[currentIndex]
    if (!currentContainer) return

    isRotatingRef.current = true
    gsap.to(currentContainer, {
      opacity: 0,
      y: 12,
      duration: 0.65,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentIndex((prev) => (prev + 1) % sections.length)
      },
    })
  }

  return (
    <>
      {isLoading && (
        <div className="loading-screen">
          <div className="loader">
            <div className="logoline"></div>
            <div className="logoname-wrapper">
              <h1 className="logoname">Inno'studio</h1>
            </div>
          </div>
        </div>
      )}

      <div id="page-content" className="home-page">
        <div className="text-refresh-wrapper">
          {sections.map((section, index) => (
            <div
              key={section.title}
              className={`text-refresh-container${index === currentIndex ? ' active' : ''}`}
              ref={(el) => {
                containerRefs.current[index] = el
              }}
            >
              <div className="text-container">
                <h1>{section.title}</h1>
                <p className="small-line" data-text={section.text}>
                  <span className="typing-text">{section.text}</span>
                </p>

                <div className="button-container">
                  <button className="view-more-btn">View More</button>
                </div>
              </div>
              <button className="refresh-btn" onClick={handleRefresh} aria-label="Refresh section">
                <i className="fa-solid fa-rotate-right"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Home
