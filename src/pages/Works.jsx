import { usePageAnimation } from '../hooks/usePageAnimation'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { projects } from '../data/projects.js'
import { getScrollContainer, scrollElementTo, startProjectEntryTransition } from '../utils/projectTransition.js'

const valueItems = [
  {
    number: '01',
    title: 'Team culture',
    description:
      'I care about respectful collaboration, clear communication, and shared ownership so strong ideas can move from concept to execution without friction.',
  },
  {
    number: '02',
    title: 'Product clarity',
    description:
      'Every decision should support the main goal. I prioritize structure, readability, and intentional interactions that help users understand what matters quickly.',
  },
  {
    number: '03',
    title: 'Craft quality',
    description:
      'I value clean code, thoughtful UI rhythm, and consistent detail. The result should feel reliable, polished, and easy to maintain as products evolve.',
  },
  {
    number: '04',
    title: 'Long-term impact',
    description:
      'I focus on scalable systems and practical decisions that keep products stable today while leaving room for future growth and iteration.',
  },
]

function MightyCover() {
  return (
    <div className="works-mighty-cover" aria-label="Mighty Demo project preview">
      <div className="works-mighty-cover-nav">
        <strong>MIGHTY</strong>
        <span>Projects</span>
        <span>Studio</span>
        <span>Contact</span>
      </div>
      <div className="works-mighty-cover-copy">
        <span>01 / 06</span>
        <strong>Digital experiences for people who care how things feel.</strong>
      </div>
      <div className="works-mighty-cover-panel">
        <span>Selected work</span>
        <strong>2026</strong>
      </div>
      <div className="works-mighty-cover-phone" aria-hidden="true">
        <span></span>
        <p>Made for motion.</p>
      </div>
      <div className="works-mighty-cover-dots" aria-hidden="true"></div>
    </div>
  )
}

function ProjectCover({ project }) {
  if (project.cover.kind === 'mighty-system') {
    return <MightyCover />
  }

  return <img src={project.cover.src} alt={project.cover.alt} className="works-project-image" loading="lazy" />
}

function Works() {
  const { motion, variants } = usePageAnimation()
  const MotionDiv = motion.div
  const location = useLocation()
  const navigate = useNavigate()
  const projectsRef = useRef(null)
  const leftColumnRef = useRef(null)
  const rightColumnRef = useRef(null)
  const pendingProjectScrollRef = useRef(null)
  const [showScrollCue, setShowScrollCue] = useState(true)

  const getCurrentWorksScroll = () => {
    const scrollContainer = getScrollContainer()
    return scrollContainer?.scrollTop || 0
  }

  const captureProjectScroll = () => {
    pendingProjectScrollRef.current = getCurrentWorksScroll()
  }

  const openProject = (event, project) => {
    startProjectEntryTransition({
      event,
      navigate,
      project,
      worksScrollY: pendingProjectScrollRef.current ?? getCurrentWorksScroll(),
    })
    pendingProjectScrollRef.current = null
  }

  useEffect(() => {
    if (!location.state?.projectReturn) return undefined

    let frameId = requestAnimationFrame(() => {
      const scrollContainer = getScrollContainer()
      scrollElementTo(scrollContainer, location.state.restoreScrollY || 0)
      requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent('innostudio:works-ready'))
      })
    })

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [location.state])

  useEffect(() => {
    const scrollContainer = document.querySelector('.page-transition')
    if (!projectsRef.current || !scrollContainer) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollCue(!entry.isIntersecting)
      },
      {
        root: scrollContainer,
        threshold: 0.14,
      }
    )

    observer.observe(projectsRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const scrollContainer = document.querySelector('.page-transition')
    const leftColumn = leftColumnRef.current
    const rightColumn = rightColumnRef.current

    if (!scrollContainer || !leftColumn || !rightColumn) return undefined

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return undefined

    let animationFrameId = null
    let previousScrollTop = scrollContainer.scrollTop
    let lastDirection = 'down'
    let leftOffset = 0
    let rightOffset = 0

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

    const animateColumns = () => {
      const currentScrollTop = scrollContainer.scrollTop
      const scrollDelta = currentScrollTop - previousScrollTop
      previousScrollTop = currentScrollTop

      if (Math.abs(scrollDelta) > 0.05) {
        lastDirection = scrollDelta > 0 ? 'down' : 'up'
      }

      const velocity = clamp(scrollDelta, -26, 26)
      const depth = clamp(Math.abs(velocity) * 2.4, 0, 44)

      let leftTarget = 0
      let rightTarget = 0
      let leftEase = 0.14
      let rightEase = 0.14

      if (lastDirection === 'down') {
        rightTarget = depth * 0.18
        leftTarget = depth
        leftEase = 0.07
        rightEase = 0.26
      } else {
        leftTarget = -depth * 0.18
        rightTarget = -depth
        leftEase = 0.26
        rightEase = 0.07
      }

      if (Math.abs(velocity) < 0.1) {
        leftTarget = 0
        rightTarget = 0
      }

      leftOffset += (leftTarget - leftOffset) * leftEase
      rightOffset += (rightTarget - rightOffset) * rightEase

      leftColumn.style.transform = `translate3d(0, ${leftOffset.toFixed(2)}px, 0)`
      rightColumn.style.transform = `translate3d(0, ${rightOffset.toFixed(2)}px, 0)`

      animationFrameId = requestAnimationFrame(animateColumns)
    }

    animationFrameId = requestAnimationFrame(animateColumns)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <MotionDiv
      id="page-content"
      className="page-content works-page"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      <div className="works-header">
        <div className="works-block">
          <h1 className="works-heading">Works</h1>
          <div className="works-line-row">
            <span className="works-line" aria-hidden="true"></span>
            <p className="works-text">A showcase of my projects and experiments.</p>
          </div>
        </div>
      </div>

      <div className="works-inner">
        <section className="works-values" aria-label="What is important to me">
          <div className="works-values-intro">
            <h2 className="works-values-title">What&apos;s important to me</h2>
            <p className="works-values-text">
              I approach projects with structure, clarity, and intention—balancing design, engineering,
              and collaboration to build work that is both meaningful and sustainable.
            </p>
          </div>

          <div className="works-values-grid">
            {valueItems.map((item) => (
              <article key={item.number} className="works-value-item">
                <p className="works-value-number">{item.number}</p>
                <h3 className="works-value-item-title">{item.title}</h3>
                <p className="works-value-description">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <div className={`works-scroll-cue${showScrollCue ? ' is-visible' : ''}`} aria-hidden={!showScrollCue}>
          <span className="works-scroll-cue-text">Scroll down</span>
          <span className="works-scroll-cue-arrow">↓</span>
        </div>

        <section ref={projectsRef} className="works-projects" aria-label="Selected projects">
          <div className="works-projects-grid">
            <div ref={leftColumnRef} className="works-projects-column">
              {projects.slice(0, 3).map((project) => (
                <Link
                  key={project.id}
                  to={`/work/${project.slug}`}
                  className={`works-project-card ${project.card.variant}`}
                  onPointerDownCapture={captureProjectScroll}
                  onClick={(event) => openProject(event, project)}
                >
                  <h3 className="works-project-title">{project.title}</h3>
                  <div className="works-project-media">
                    <ProjectCover project={project} />
                  </div>
                </Link>
              ))}
            </div>

            <div ref={rightColumnRef} className="works-projects-column">
              {projects.slice(3).map((project) => (
                <Link
                  key={project.id}
                  to={`/work/${project.slug}`}
                  className={`works-project-card ${project.card.variant}`}
                  onPointerDownCapture={captureProjectScroll}
                  onClick={(event) => openProject(event, project)}
                >
                  <h3 className="works-project-title">{project.title}</h3>
                  <div className="works-project-media">
                    <ProjectCover project={project} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MotionDiv>
  )
}

export default Works
