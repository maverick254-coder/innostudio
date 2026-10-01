import { gsap } from 'gsap'

const PROJECT_ENTER_DURATION = 0.75
const PROJECT_EXIT_DURATION = 0.75
const PROJECT_ENTER_EASE = 'power3.inOut'
const PROJECT_EXIT_EASE = 'power3.inOut'
const WORKS_SCROLL_KEY = 'innostudio:works-scroll-y'
const TRANSITION_ACTIVE_CLASS = 'project-route-transition-active'
const TRANSITION_LOCK_CLASS = 'project-transition-lock'
const PROJECT_READY_EVENT = 'innostudio:project-ready'
const PROJECT_ENTRY_COMPLETE_EVENT = 'innostudio:project-entry-complete'
const WORKS_READY_EVENT = 'innostudio:works-ready'
const CLICKED_CARD_VISUAL_SELECTOR = '.works-mighty-cover, .works-project-image'
let preservedWorksLayer = null
let restoreTransitionChrome = null

export function getScrollContainer() {
  return document.querySelector('.page-transition')
}

export function scrollElementTo(element, top) {
  if (!element) return

  const nextTop = Number.isFinite(Number(top)) ? Number(top) : 0
  const lenis = window.__innostudioLenis

  if (lenis?.scrollTo) {
    lenis.resize?.()
    lenis.scrollTo(nextTop, {
      force: true,
      immediate: true,
      lock: true,
    })
  }

  if (typeof element.scrollTo === 'function') {
    element.scrollTo({ top: nextTop, behavior: 'auto' })
    return
  }

  element.scrollTop = nextTop
}

export function getStoredWorksScroll() {
  const value = sessionStorage.getItem(WORKS_SCROLL_KEY)
  return Number.isFinite(Number(value)) ? Number(value) : 0
}

export function storeWorksScroll(scrollY) {
  sessionStorage.setItem(WORKS_SCROLL_KEY, String(Math.max(0, Math.round(scrollY || 0))))
}

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

function removeExistingStage() {
  document.querySelectorAll('.work-project-transition').forEach((stage) => stage.remove())
}

function getCssNumberValue(name, fallback) {
  const rawValue = getComputedStyle(document.documentElement).getPropertyValue(name)
  const parsedValue = Number.parseFloat(rawValue)
  return Number.isFinite(parsedValue) ? parsedValue : fallback
}

function getSidebarWidth(sidebar) {
  const rectWidth = sidebar?.getBoundingClientRect().width
  if (Number.isFinite(rectWidth) && rectWidth > 0) return rectWidth
  return getCssNumberValue('--sidebar-width', 360)
}

function hideLiveTransitionChrome() {
  restoreTransitionChrome?.()

  const elements = [...document.querySelectorAll('.sidebar, .project-scroll-rail')].filter(
    (element) => !element.closest('.work-project-transition'),
  )
  const previousValues = elements.map((element) => ({
    element,
    visibility: element.style.visibility,
  }))

  elements.forEach((element) => {
    element.style.visibility = 'hidden'
  })

  restoreTransitionChrome = () => {
    previousValues.forEach(({ element, visibility }) => {
      element.style.visibility = visibility
    })
    restoreTransitionChrome = null
  }

  return restoreTransitionChrome
}

function cloneSidebarLayer({ activeWork = false } = {}) {
  const sidebar = document.querySelector('.sidebar')
  if (!sidebar) return { layer: null, width: getCssNumberValue('--sidebar-width', 360) }

  const width = getSidebarWidth(sidebar)
  const layer = document.createElement('div')
  layer.className = 'sidebar-transition-layer'
  layer.style.width = `${width}px`

  const clone = sidebar.cloneNode(true)
  clone.classList.remove('sidebar--project-mode')
  clone.removeAttribute('style')
  if (activeWork) {
    clone.querySelector('.desktop-nav a[href="/works"]')?.classList.add('active')
  }
  clone.querySelectorAll('.desktop-nav, .sidebar-footer, .logo h1').forEach((element) => {
    element.style.opacity = '1'
  })

  layer.appendChild(clone)
  return { layer, width }
}

function createRailTransitionLayer(startX = 0) {
  const layer = document.createElement('div')
  layer.className = 'project-rail-transition-layer'
  gsap.set(layer, { x: startX })
  return layer
}

function activateProjectRouteTransition() {
  document.body.classList.add(TRANSITION_LOCK_CLASS, TRANSITION_ACTIVE_CLASS)
}

function deactivateProjectRouteTransition() {
  document.body.classList.remove(TRANSITION_LOCK_CLASS, TRANSITION_ACTIVE_CLASS)
  restoreTransitionChrome?.()
}

function waitForWindowEvent(eventName, callback, timeout = 700) {
  let timeoutId = null
  let called = false

  const done = () => {
    if (called) return
    called = true
    window.removeEventListener(eventName, done)
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    callback()
  }

  window.addEventListener(eventName, done, { once: true })
  timeoutId = setTimeout(done, timeout)
}

function afterAnimationFrames(frameCount, callback) {
  if (frameCount <= 0) {
    callback()
    return
  }

  requestAnimationFrame(() => afterAnimationFrames(frameCount - 1, callback))
}

function getUsableScrollY(scrollY, fallback = 0) {
  if (scrollY === null || scrollY === undefined || scrollY === '') {
    return fallback
  }

  const numericScrollY = Number(scrollY)
  return Number.isFinite(numericScrollY) ? numericScrollY : fallback
}

function preserveWorksLayer(layer) {
  preservedWorksLayer = layer?.cloneNode(true) || null
  if (preservedWorksLayer) {
    preservedWorksLayer.className = 'works-transition-layer works-transition-layer--preserved'
  }
}

function getPreservedWorksLayer() {
  return preservedWorksLayer?.cloneNode(true) || null
}

function findMatchingClonedCard(clone, liveCard) {
  if (!clone || !liveCard) return null

  const liveHref = liveCard.getAttribute('href')
  const clonedCards = [...clone.querySelectorAll('.works-project-card')]
  if (liveHref) {
    const hrefMatch = clonedCards.find((card) => card.getAttribute('href') === liveHref)
    if (hrefMatch) return hrefMatch
  }

  const liveCards = [...document.querySelectorAll('.page-transition .works-project-card')]
  const cardIndex = liveCards.indexOf(liveCard)
  return cardIndex >= 0 ? clonedCards[cardIndex] || null : null
}

function mirrorClickedCardVisualState(clone, clickedCard) {
  const liveCard = clickedCard?.closest?.('.works-project-card') || null
  const clonedCard = findMatchingClonedCard(clone, liveCard)
  if (!liveCard || !clonedCard) return

  clonedCard.classList.add('works-project-card--captured-active')

  const liveVisuals = [...liveCard.querySelectorAll(CLICKED_CARD_VISUAL_SELECTOR)]
  const clonedVisuals = [...clonedCard.querySelectorAll(CLICKED_CARD_VISUAL_SELECTOR)]

  liveVisuals.forEach((liveElement, index) => {
    const clonedElement = clonedVisuals[index]
    if (!clonedElement) return

    const liveStyles = getComputedStyle(liveElement)
    clonedElement.style.transform = liveStyles.transform
    clonedElement.style.filter = liveStyles.filter
    clonedElement.style.transition = 'none'
  })
}

function createTransitionAtmosphere() {
  const atmosphere = document.createElement('div')
  atmosphere.className = 'transition-atmosphere'
  atmosphere.setAttribute('aria-hidden', 'true')
  return atmosphere
}

function setProjectRevealBoundary(atmosphere, boundaryX) {
  if (!atmosphere) return

  atmosphere.style.width = `${Math.max(0, boundaryX)}px`
}

function clonePageLayer(className, scrollTop = 0, options = {}) {
  const scroller = getScrollContainer()
  const page = scroller?.querySelector('#page-content')

  if (!page) return null

  const shell = document.createElement('div')
  shell.className = className
  const isFrozenProjectLayer = className.includes('project-transition-layer--frozen')
  const originalSticky = isFrozenProjectLayer ? page.querySelector('.project-showcase-sticky') : null
  const originalShowcase = isFrozenProjectLayer ? page.querySelector('.project-showcase') : null
  const stickyRect = originalSticky?.getBoundingClientRect()
  const showcaseRect = originalShowcase?.getBoundingClientRect()
  const showcaseOffsetTop = showcaseRect ? scrollTop + showcaseRect.top : 0
  const fixedControlRects = isFrozenProjectLayer
    ? {
        close: page.querySelector('.project-close-button')?.getBoundingClientRect(),
        external: page.querySelector('.project-external-link')?.getBoundingClientRect(),
      }
    : {}
  const shouldFreezeSticky =
    Boolean(stickyRect && showcaseRect) &&
    stickyRect.top <= 1 &&
    showcaseRect.top <= 0 &&
    showcaseRect.bottom >= window.innerHeight

  const clone = page.cloneNode(true)
  clone.removeAttribute('id')
  clone.classList.add('transition-page-clone')
  clone.style.transform = `translate3d(0, ${-scrollTop}px, 0)`

  if (className.includes('works-transition-layer')) {
    const pageStyles = getComputedStyle(page)
    clone.style.marginLeft = pageStyles.marginLeft
    clone.style.width = pageStyles.width
    clone.style.maxWidth = pageStyles.maxWidth
    mirrorClickedCardVisualState(clone, options.clickedCard)
  } else {
    clone.style.marginLeft = '0'
    clone.style.width = '100%'
  }

  if (shouldFreezeSticky) {
    freezeStickyProjectClone(clone, scrollTop, stickyRect, showcaseOffsetTop, fixedControlRects)
  }

  shell.appendChild(clone)
  return shell
}

function freezeStickyProjectClone(clone, scrollTop, stickyRect, showcaseOffsetTop, fixedControlRects = {}) {
  const sticky = clone.querySelector('.project-showcase-sticky')
  const closeButton = clone.querySelector('.project-close-button')
  const externalLink = clone.querySelector('.project-external-link')

  if (sticky) {
    sticky.style.position = 'absolute'
    sticky.style.top = `${scrollTop - showcaseOffsetTop + stickyRect.top}px`
    sticky.style.left = '0'
    sticky.style.width = '100vw'
    sticky.style.height = '100vh'
  }

  ;[
    [closeButton, fixedControlRects.close],
    [externalLink, fixedControlRects.external],
  ].forEach(([element, rect]) => {
    if (!element || !rect) return

    element.style.position = 'absolute'
    element.style.top = `${scrollTop + rect.top}px`
    element.style.left = `${rect.left}px`
    element.style.right = 'auto'
  })
}

export function startProjectEntryTransition({ event, navigate, project, worksScrollY }) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
    return
  }

  event.preventDefault()

  const scroller = getScrollContainer()
  const scrollTop = getUsableScrollY(worksScrollY, scroller?.scrollTop || 0)
  storeWorksScroll(scrollTop)

  if (prefersReducedMotion()) {
    navigate(`/work/${project.slug}`, {
      state: { projectEntry: true, worksScrollY: scrollTop },
    })
    return
  }

  removeExistingStage()

  const stage = document.createElement('div')
  stage.className = 'work-project-transition is-entering'

  const worksLayer = clonePageLayer('works-transition-layer', scrollTop, {
    clickedCard: event.currentTarget,
  })
  const { layer: sidebarLayer, width: sidebarWidth } = cloneSidebarLayer()
  const railStartX = Math.max(0, sidebarWidth - 3)
  const railLayer = createRailTransitionLayer(railStartX)
  const atmosphereLayer = createTransitionAtmosphere()

  if (!worksLayer) {
    navigate(`/work/${project.slug}`, {
      state: { projectEntry: true, worksScrollY: scrollTop },
    })
    return
  }

  preserveWorksLayer(worksLayer)
  stage.append(atmosphereLayer, worksLayer)
  if (sidebarLayer) stage.append(sidebarLayer)
  stage.append(railLayer)
  document.body.appendChild(stage)
  hideLiveTransitionChrome()
  activateProjectRouteTransition()

  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1440
  gsap.set(worksLayer, { x: 0 })
  if (sidebarLayer) gsap.set(sidebarLayer, { x: 0 })

  navigate(`/work/${project.slug}`, {
    state: { projectEntry: true, worksScrollY: scrollTop, customProjectTransition: true },
  })

  waitForWindowEvent(PROJECT_READY_EVENT, () => {
    const projectLayer = document.querySelector('.project-experience')
    if (projectLayer) {
      gsap.set(projectLayer, { x: viewportWidth })
    }
    setProjectRevealBoundary(atmosphereLayer, railStartX)

    const timeline = gsap.timeline({
      defaults: { duration: PROJECT_ENTER_DURATION, ease: PROJECT_ENTER_EASE },
      onComplete: () => {
        let handoffLayer = null
        if (projectLayer) {
          gsap.set(projectLayer, { x: 0 })
          handoffLayer = clonePageLayer('project-transition-layer project-transition-layer--handoff', 0)
          if (handoffLayer) {
            gsap.set(handoffLayer, { x: 0 })
            stage.append(handoffLayer)
          }
        }
        deactivateProjectRouteTransition()
        if (projectLayer) {
          gsap.set(projectLayer, { clearProps: 'transform' })
        }
        window.dispatchEvent(new CustomEvent(PROJECT_ENTRY_COMPLETE_EVENT))
        afterAnimationFrames(4, () => {
          stage.remove()
        })
      },
    })

    timeline.to(worksLayer, { x: -viewportWidth }, 0)
    if (sidebarLayer) {
      timeline.to(sidebarLayer, { x: -sidebarWidth }, 0)
    }
    timeline.to(railLayer, { x: 0 }, 0)
    timeline.to(atmosphereLayer, { width: 0 }, 0)
    if (projectLayer) {
      timeline.to(projectLayer, { x: 0 }, 0)
    }
  }, 900)
}

export function startProjectExitTransition({ navigate, restoreScrollY }) {
  const scroller = getScrollContainer()
  const lenisScroll = window.__innostudioLenis?.scroll ?? window.__innostudioLenis?.animatedScroll
  const projectScrollTop = Number.isFinite(Number(lenisScroll)) ? Number(lenisScroll) : scroller?.scrollTop || 0
  const scrollY = getUsableScrollY(restoreScrollY, getStoredWorksScroll())

  if (prefersReducedMotion()) {
    navigate('/works', {
      state: { projectReturn: true, restoreScrollY: scrollY },
    })
    return
  }

  removeExistingStage()

  const stage = document.createElement('div')
  stage.className = 'work-project-transition is-leaving'

  const projectLayer = clonePageLayer('project-transition-layer project-transition-layer--frozen', projectScrollTop)
  const worksLayer = getPreservedWorksLayer()
  const { layer: sidebarLayer, width: sidebarWidth } = cloneSidebarLayer({ activeWork: true })
  const railLayer = createRailTransitionLayer(0)

  if (!projectLayer || !worksLayer) {
    navigate('/works', {
      state: { projectReturn: true, restoreScrollY: scrollY },
    })
    return
  }
  worksLayer.className = 'works-transition-layer works-transition-layer--preserved'
  stage.append(createTransitionAtmosphere(), worksLayer, projectLayer)
  if (sidebarLayer) stage.append(sidebarLayer)
  stage.append(railLayer)
  document.body.appendChild(stage)
  hideLiveTransitionChrome()
  activateProjectRouteTransition()

  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1440
  gsap.set(worksLayer, { x: -viewportWidth })
  gsap.set(projectLayer, { x: 0 })
  if (sidebarLayer) gsap.set(sidebarLayer, { x: -sidebarWidth })
  gsap.set(railLayer, { x: 0 })

  const startExitAnimation = () => {
    const activeWorksLayer = worksLayer

    const timeline = gsap.timeline({
      defaults: { duration: PROJECT_EXIT_DURATION, ease: PROJECT_EXIT_EASE },
      onComplete: () => {
        projectLayer.remove()

        navigate('/works', {
          state: { projectReturn: true, restoreScrollY: scrollY, customProjectTransition: true },
        })

        waitForWindowEvent(WORKS_READY_EVENT, () => {
          const nextScroller = getScrollContainer()
          scrollElementTo(nextScroller, scrollY)
          deactivateProjectRouteTransition()
          afterAnimationFrames(2, () => {
            stage.remove()
          })
        }, 900)
      },
    })

    timeline.to(projectLayer, { x: viewportWidth }, 0)
    timeline.to(activeWorksLayer, { x: 0 }, 0)
    if (sidebarLayer) {
      timeline.to(sidebarLayer, { x: 0 }, 0)
    }
    timeline.to(railLayer, { x: Math.max(0, sidebarWidth - 3) }, 0)
  }

  startExitAnimation()
}

export function __getPreservedWorksLayerForTest() {
  return preservedWorksLayer
}

export function __resetProjectTransitionStateForTest() {
  preservedWorksLayer = null
  restoreTransitionChrome?.()
  removeExistingStage()
  deactivateProjectRouteTransition()
}
