import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getProjectBySlug, getProjectShowcaseMedia } from '../data/projects.js'
import useMagneticButton from '../hooks/useMagneticButton.js'
import { getScrollContainer, getStoredWorksScroll, scrollElementTo, startProjectExitTransition } from '../utils/projectTransition.js'
import NotFound from './NotFound.jsx'

gsap.registerPlugin(ScrollTrigger)

const MEDIA_DEFAULTS = {
  desktop: {
    width: 'clamp(680px, 56vw, 900px)',
    tabletWidth: 'min(82vw, 900px)',
    restScale: 0.7,
    restOpacity: 0.44,
    offsetY: '0vh',
  },
  mobile: {
    width: 'calc(clamp(520px, 70vh, 680px) * var(--media-ratio))',
    tabletWidth: 'min(48vw, 320px)',
    restScale: 0.72,
    restOpacity: 0.46,
    offsetY: '3vh',
  },
  portrait: {
    width: '20vw',
    tabletWidth: '42vw',
    restScale: 0.66,
    restOpacity: 0.34,
    offsetY: '-4vh',
  },
  landscape: {
    width: '48vw',
    tabletWidth: '72vw',
    restScale: 0.68,
    restOpacity: 0.36,
    offsetY: '1vh',
  },
}

const ROLE_WIDTHS = {
  home: 'clamp(680px, 56vw, 900px)',
  about: 'clamp(680px, 56vw, 900px)',
  services: 'clamp(680px, 56vw, 900px)',
}

const MEDIA_GAPS = {
  'desktop-mobile': 'clamp(90px, 7vw, 115px)',
  'mobile-desktop': 'clamp(100px, 7.8vw, 125px)',
  'desktop-desktop': 'clamp(110px, 8vw, 140px)',
  'mobile-mobile': 'clamp(80px, 6vw, 105px)',
  'desktop-portrait': '9vw',
  'portrait-landscape': '8vw',
  'landscape-portrait': '8vw',
}

function getMediaDefaults(media) {
  return MEDIA_DEFAULTS[media.type] || MEDIA_DEFAULTS.landscape
}

export function resolveProjectMediaWidth(media) {
  if (media.widthOverride) return media.widthOverride

  if (media.view === 'mobile' || media.type === 'mobile') {
    return MEDIA_DEFAULTS.mobile.width
  }

  if (media.role && ROLE_WIDTHS[media.role]) {
    return ROLE_WIDTHS[media.role]
  }

  return getMediaDefaults(media).width
}

function getGapBefore(previousMedia, media, index) {
  if (index === 0 || !previousMedia) return '0vw'

  return MEDIA_GAPS[`${previousMedia.type}-${media.type}`] || '8vw'
}

function ProjectMediaItem({ media, previousMedia, index }) {
  const defaults = getMediaDefaults(media)
  const width = resolveProjectMediaWidth(media)
  const tabletWidth = media.tabletWidth || defaults.tabletWidth
  const offsetY = media.offsetY || defaults.offsetY
  const ratio = media.width && media.height ? media.width / media.height : 1

  return (
    <article
      className={`project-media-item project-media-item--${media.type} project-media-item--${media.role} project-media-item--${media.tone}`}
      data-showcase-role={media.role}
      data-page-id={media.pageId || media.role}
      data-page-label={media.pageLabel || media.role}
      data-media-view={media.view || media.type}
      data-media-type={media.type}
      style={{
        '--media-width': width,
        '--media-width-tablet': tabletWidth,
        '--media-ratio': ratio,
        '--media-offset-y': offsetY,
        '--media-gap-before': getGapBefore(previousMedia, media, index),
        '--media-rest-scale': media.restScale || defaults.restScale,
        '--media-rest-opacity': media.restOpacity || defaults.restOpacity,
        aspectRatio: media.aspectRatio,
      }}
    >
      <div className="project-media-transform">
        <div className="project-media-surface">
          <img
            className="project-media-image"
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            loading={index < 2 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            decoding="async"
          />
        </div>
      </div>
      <span className="project-media-count">{String(index + 1).padStart(2, '0')}</span>
    </article>
  )
}

function Project() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)
  const navigate = useNavigate()
  const location = useLocation()
  const rootRef = useRef(null)
  const closeButtonRef = useRef(null)
  const showcaseRef = useRef(null)
  const trackRef = useRef(null)
  const isClosingRef = useRef(false)
  const isCustomEntry = Boolean(location.state?.projectEntry && location.state?.customProjectTransition)
  const [canInitShowcase, setCanInitShowcase] = useState(!isCustomEntry)
  useMagneticButton(closeButtonRef)

  useLayoutEffect(() => {
    if (!project) return undefined

    const scrollContainer = getScrollContainer()
    const resetToTop = () => {
      scrollElementTo(scrollContainer || getScrollContainer(), 0)
      ScrollTrigger.refresh()
    }
    const frameIds = []
    const timeoutIds = []
    let readyFrameId = null

    resetToTop()

    if (isCustomEntry) {
      readyFrameId = requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent('innostudio:project-ready'))
      })
    }

    frameIds.push(requestAnimationFrame(resetToTop))
    frameIds.push(requestAnimationFrame(() => frameIds.push(requestAnimationFrame(resetToTop))))
    timeoutIds.push(setTimeout(resetToTop, 140))
    timeoutIds.push(setTimeout(resetToTop, 320))

    return () => {
      frameIds.forEach((frameId) => cancelAnimationFrame(frameId))
      if (readyFrameId) {
        cancelAnimationFrame(readyFrameId)
      }
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId))
    }
  }, [isCustomEntry, project, slug])

  useEffect(() => {
    if (!isCustomEntry) return undefined

    const handleEntryComplete = () => {
      setCanInitShowcase(true)
    }

    window.addEventListener('innostudio:project-entry-complete', handleEntryComplete, { once: true })

    return () => {
      window.removeEventListener('innostudio:project-entry-complete', handleEntryComplete)
    }
  }, [isCustomEntry])

  useLayoutEffect(() => {
    if (!project || !rootRef.current) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const context = gsap.context(() => {
      if (!reduceMotion && !isCustomEntry) {
        gsap.fromTo(
          ['.project-hero-title', '.project-hero-tagline'],
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: isCustomEntry ? 0.4 : 0.75,
            ease: 'power3.out',
            stagger: 0.12,
            delay: isCustomEntry ? 0 : 0.1,
          },
        )
      }

      const showcase = showcaseRef.current
      const track = trackRef.current
      const scroller = getScrollContainer()
      const canUseHorizontal = canInitShowcase && !reduceMotion && window.matchMedia('(min-width: 768px)').matches

      if (!showcase || !track || !scroller || !canUseHorizontal) return

      const items = gsap.utils.toArray('.project-media-item')
      const clamp = gsap.utils.clamp(0, 1)

      const setFocusState = () => {
        const viewportCenter = window.innerWidth / 2
        const focusRange = window.innerWidth * 0.48

        items.forEach((item) => {
          const rect = item.getBoundingClientRect()
          const distance = Math.abs(rect.left + rect.width / 2 - viewportCenter)
          const rawFocus = clamp(1 - distance / focusRange)
          const focus = rawFocus * rawFocus * (3 - 2 * rawFocus)
          const restScale = Number.parseFloat(item.style.getPropertyValue('--media-rest-scale')) || 0.68
          const restOpacity = Number.parseFloat(item.style.getPropertyValue('--media-rest-opacity')) || 0.36

          gsap.set(item, {
            '--media-depth-scale': restScale + (1 - restScale) * focus,
            '--media-depth-opacity': restOpacity + (1 - restOpacity) * focus,
            zIndex: Math.round(1 + focus * 20),
          })
        })
      }

      const updateTrackPadding = () => {
        const firstItem = items[0]
        const lastItem = items[items.length - 1]

        if (!firstItem || !lastItem) return

        track.style.paddingLeft = `${Math.max(0, (window.innerWidth - firstItem.offsetWidth) / 2)}px`
        track.style.paddingRight = `${Math.max(0, (window.innerWidth - lastItem.offsetWidth) / 2)}px`
      }

      const calculateTravel = () => {
        updateTrackPadding()
        return Math.max(0, track.scrollWidth - window.innerWidth)
      }

      gsap.to(track, {
        x: () => -calculateTravel(),
        ease: 'none',
        scrollTrigger: {
          trigger: showcase,
          scroller,
          start: 'top top',
          end: () => `+=${Math.max(calculateTravel(), window.innerHeight * 1.35)}`,
          scrub: 0.55,
          invalidateOnRefresh: true,
          onUpdate: setFocusState,
          onRefresh: () => {
            const travel = calculateTravel()
            showcase.style.setProperty('--showcase-scroll-distance', `${Math.max(travel, window.innerHeight * 1.35)}px`)
            setFocusState()
          },
        },
      })

      updateTrackPadding()
      setFocusState()
      ScrollTrigger.refresh()
    }, rootRef)

    const showcaseNode = showcaseRef.current

    return () => {
      context.revert()
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === showcaseNode) {
          trigger.kill()
        }
      })
    }
  }, [canInitShowcase, isCustomEntry, project])

  useEffect(() => {
    if (!project) return undefined

    const closeProject = () => {
      if (isClosingRef.current) return
      isClosingRef.current = true

      startProjectExitTransition({
        navigate,
        restoreScrollY: location.state?.worksScrollY ?? getStoredWorksScroll(),
      })
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeProject()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.closeProjectExperience = closeProject

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (window.closeProjectExperience === closeProject) {
        delete window.closeProjectExperience
      }
    }
  }, [location.state?.worksScrollY, navigate, project])

  if (!project) {
    return <NotFound />
  }

  const closeProject = () => {
    if (window.closeProjectExperience) {
      window.closeProjectExperience()
      return
    }

    navigate('/works')
  }

  const showcaseMedia = getProjectShowcaseMedia(project)

  return (
    <main id="page-content" className="page-content project-page project-experience" ref={rootRef}>
      <button
        type="button"
        ref={closeButtonRef}
        className="project-close-button magnetic-button"
        onClick={closeProject}
        aria-label="Close project"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M7 7L17 17" />
          <path d="M17 7L7 17" />
        </svg>
      </button>

      {project.externalUrl && (
        <a className="project-external-link" href={project.externalUrl} aria-label="Visit project">
          ↗
        </a>
      )}

      <section className="project-hero" aria-labelledby="project-title">
        <div className="project-hero-copy">
          <h1 id="project-title" className="project-hero-title">{project.title}</h1>
          {project.tagline && (
            <p className="project-hero-tagline">— {project.tagline}</p>
          )}
        </div>
      </section>

      <section className="project-info" aria-label="Project information">
        <div className="project-info-meta">
          <div>
            <p>Role</p>
            {project.metadata.roles.map((role) => (
              <span key={role}>{role}</span>
            ))}
          </div>
          <div>
            <p>Client</p>
            <span>{project.metadata.client}</span>
          </div>
          <div>
            <p>Year</p>
            <span>{project.metadata.year}</span>
          </div>
          <div>
            <p>Type</p>
            <span>{project.metadata.type}</span>
          </div>
        </div>
        <p className="project-info-description">{project.description}</p>
      </section>

      <section ref={showcaseRef} className="project-showcase" aria-label={`${project.title} media showcase`}>
        <div className="project-showcase-sticky">
          <div ref={trackRef} className="project-showcase-track">
            {showcaseMedia.map((media, index) => (
              <ProjectMediaItem
                key={media.id}
                media={media}
                previousMedia={showcaseMedia[index - 1]}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Project
