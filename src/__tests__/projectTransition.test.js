import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  __getPreservedWorksLayerForTest,
  __resetProjectTransitionStateForTest,
  startProjectEntryTransition,
  startProjectExitTransition,
} from '../utils/projectTransition.js'

function installPage(markup, scrollTop = 0) {
  document.body.innerHTML = `
    <div class="page-transition">
      <main id="page-content">${markup}</main>
    </div>
  `

  const scroller = document.querySelector('.page-transition')
  Object.defineProperty(scroller, 'scrollTop', {
    configurable: true,
    writable: true,
    value: scrollTop,
  })
  scroller.scrollTo = vi.fn(({ top }) => {
    scroller.scrollTop = top
  })

  return scroller
}

function installPageWithGeometry(markup, scrollTop = 0) {
  const scroller = installPage(markup, scrollTop)
  const page = document.querySelector('#page-content')
  page.style.marginLeft = '360px'
  page.style.width = '1080px'
  return scroller
}

function installTransitionChrome() {
  document.body.insertAdjacentHTML(
    'beforeend',
    `
      <aside class="sidebar">
        <a class="logo"><h1>Creative Developer</h1></a>
        <nav class="desktop-nav"><a href="/works">Work</a><a href="/about">About</a></nav>
        <div class="sidebar-footer">Email</div>
      </aside>
      <div class="project-scroll-rail"></div>
    `,
  )
}

describe('project transition preservation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    __resetProjectTransitionStateForTest()
    document.body.innerHTML = ''
  })

  it('preserves the actual Works DOM layer on project entry', () => {
    installPage('<section data-testid="real-works"><h1>Works</h1><article>Mighty cover</article></section>', 640)
    const navigate = vi.fn()
    const preventDefault = vi.fn()

    startProjectEntryTransition({
      event: { button: 0, preventDefault },
      navigate,
      project: { slug: 'mighty-demo', title: 'Mighty', tagline: 'Carefully built.' },
      worksScrollY: 640,
    })

    const preserved = __getPreservedWorksLayerForTest()

    expect(preventDefault).toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith('/work/mighty-demo', {
      state: { projectEntry: true, worksScrollY: 640, customProjectTransition: true },
    })
    expect(preserved?.querySelector('[data-testid="real-works"]')).toBeTruthy()
    expect(preserved?.textContent).toContain('Mighty cover')
    expect(preserved?.querySelector('.transition-page-clone')?.style.transform).toContain('-640px')
    expect(document.querySelector('.project-transition-preview-media')).not.toBeInTheDocument()
    expect(document.querySelector('.project-transition-layer')).not.toBeInTheDocument()
    expect(document.body).toHaveClass('project-route-transition-active')
  })

  it('preserves live Works geometry in the staged page clone', () => {
    installPageWithGeometry('<section data-testid="real-works"><h1>Works</h1><article>Mighty cover</article></section>', 640)

    startProjectEntryTransition({
      event: { button: 0, preventDefault: vi.fn() },
      navigate: vi.fn(),
      project: { slug: 'mighty-demo', title: 'Mighty' },
      worksScrollY: 640,
    })

    const clone = document.querySelector('.works-transition-layer .transition-page-clone')

    expect(clone?.style.marginLeft).toBe('360px')
    expect(clone?.style.width).toBe('1080px')
  })

  it('places the opaque atmosphere surface on the stationary transition stage', () => {
    installPageWithGeometry('<section data-testid="real-works"><h1>Works</h1><article>Mighty cover</article></section>', 640)

    startProjectEntryTransition({
      event: { button: 0, preventDefault: vi.fn() },
      navigate: vi.fn(),
      project: { slug: 'mighty-demo', title: 'Mighty' },
      worksScrollY: 640,
    })

    const stage = document.querySelector('.work-project-transition')
    const worksLayer = document.querySelector('.works-transition-layer')
    const atmosphere = stage?.querySelector(':scope > .transition-atmosphere')

    expect(atmosphere).toBeInTheDocument()
    expect(worksLayer?.querySelector(':scope > .transition-atmosphere')).not.toBeInTheDocument()
    expect([...stage.children].indexOf(atmosphere)).toBeLessThan([...stage.children].indexOf(worksLayer))
  })

  it('mirrors the clicked Works card media state into the staged clone before it owns the frame', () => {
    installPageWithGeometry(
      `
        <section class="works-page">
          <a class="works-project-card" href="/work/mighty-demo">
            <span class="works-project-title">Mighty Demo</span>
            <div class="works-mighty-cover"></div>
          </a>
        </section>
      `,
      640,
    )
    const clickedCard = document.querySelector('a[href="/work/mighty-demo"]')
    const liveCover = clickedCard.querySelector('.works-mighty-cover')
    const realGetComputedStyle = window.getComputedStyle.bind(window)
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      const styles = realGetComputedStyle(element)
      if (element === liveCover) {
        return new Proxy(styles, {
          get(target, property, receiver) {
            if (property === 'transform') return 'matrix(1.04, 0, 0, 1.04, 0, 0)'
            if (property === 'filter') return 'brightness(0.82) saturate(0.94)'
            return Reflect.get(target, property, receiver)
          },
        })
      }
      return styles
    })

    startProjectEntryTransition({
      event: {
        button: 0,
        currentTarget: clickedCard,
        preventDefault: vi.fn(),
      },
      navigate: vi.fn(),
      project: { slug: 'mighty-demo', title: 'Mighty' },
      worksScrollY: 640,
    })

    const clonedCover = document.querySelector('.works-transition-layer a[href="/work/mighty-demo"] .works-mighty-cover')

    expect(clonedCover?.style.transform).toBe('matrix(1.04, 0, 0, 1.04, 0, 0)')
    expect(clonedCover?.style.filter).toBe('brightness(0.82) saturate(0.94)')
  })

  it('falls back to the actual Works scroll when no captured pointer scroll is provided', () => {
    installPage('<section data-testid="real-works"><h1>Works</h1><article>Mighty cover</article></section>', 640)
    const navigate = vi.fn()

    startProjectEntryTransition({
      event: { button: 0, preventDefault: vi.fn() },
      navigate,
      project: { slug: 'mighty-demo', title: 'Mighty' },
      worksScrollY: null,
    })

    expect(navigate).toHaveBeenCalledWith('/work/mighty-demo', {
      state: { projectEntry: true, worksScrollY: 640, customProjectTransition: true },
    })
    expect(__getPreservedWorksLayerForTest()?.querySelector('.transition-page-clone')?.style.transform).toContain('-640px')
  })

  it('stages the live sidebar and rail so route classes cannot make them jump independently', () => {
    installPage('<section data-testid="real-works"><h1>Works</h1><article>Mighty cover</article></section>', 640)
    installTransitionChrome()

    startProjectEntryTransition({
      event: { button: 0, preventDefault: vi.fn() },
      navigate: vi.fn(),
      project: { slug: 'mighty-demo', title: 'Mighty' },
      worksScrollY: 640,
    })

    const stage = document.querySelector('.work-project-transition')
    const liveSidebar = document.querySelector('body > .sidebar')
    const liveRail = document.querySelector('body > .project-scroll-rail')

    expect(stage?.querySelector('.sidebar-transition-layer')?.textContent).toContain('Work')
    expect(stage?.querySelector('.project-rail-transition-layer')).toBeTruthy()
    expect(liveSidebar?.style.visibility).toBe('hidden')
    expect(liveRail?.style.visibility).toBe('hidden')
  })

  it('uses the moving rail as the reveal boundary for the incoming project', () => {
    installPage('<section data-testid="real-works"><h1>Works</h1><article>Mighty cover</article></section>', 640)
    installTransitionChrome()

    startProjectEntryTransition({
      event: { button: 0, preventDefault: vi.fn() },
      navigate: vi.fn(),
      project: { slug: 'mighty-demo', title: 'Mighty' },
      worksScrollY: 640,
    })

    document.querySelector('.page-transition').innerHTML = `
      <main id="page-content" class="project-experience"><h1>Mighty</h1></main>
    `

    window.dispatchEvent(new CustomEvent('innostudio:project-ready'))

    expect(document.querySelector('.transition-atmosphere')?.style.width).toBe('357px')
    expect(document.querySelector('.project-experience')?.style.transform).toContain('translate')
  })

  it('uses preserved Works state on exit without scrolling or navigating away from the project synchronously', () => {
    installPage('<section data-testid="real-works"><h1>Works</h1><article>Mighty cover</article></section>', 320)
    startProjectEntryTransition({
      event: { button: 0, preventDefault: vi.fn() },
      navigate: vi.fn(),
      project: { slug: 'mighty-demo', title: 'Mighty' },
      worksScrollY: 320,
    })
    document.querySelectorAll('.work-project-transition').forEach((stage) => stage.remove())
    const scroller = installPage('<section data-testid="project-frame"><h1>Mighty</h1><article>Current gallery frame</article></section>', 2700)
    const navigate = vi.fn()

    startProjectExitTransition({ navigate, restoreScrollY: 320 })

    expect(scroller.scrollTo).not.toHaveBeenCalled()
    expect(document.querySelector('.works-transition-layer--preserved')?.textContent).toContain('Mighty cover')
    expect(document.querySelector('.project-transition-layer--frozen')?.textContent).toContain('Current gallery frame')
    expect(navigate).not.toHaveBeenCalled()
    expect(document.body).toHaveClass('project-route-transition-active')
  })

  it('stages sidebar and rail on exit so they return with Works instead of snapping from route state', () => {
    installPage('<section data-testid="real-works"><h1>Works</h1><article>Mighty cover</article></section>', 320)
    installTransitionChrome()
    startProjectEntryTransition({
      event: { button: 0, preventDefault: vi.fn() },
      navigate: vi.fn(),
      project: { slug: 'mighty-demo', title: 'Mighty' },
      worksScrollY: 320,
    })
    document.querySelectorAll('.work-project-transition').forEach((stage) => stage.remove())
    installPage('<section data-testid="project-frame"><h1>Mighty</h1><article>Current gallery frame</article></section>', 2700)
    installTransitionChrome()

    startProjectExitTransition({ navigate: vi.fn(), restoreScrollY: 320 })

    const stage = document.querySelector('.work-project-transition')

    expect(stage?.querySelector('.sidebar-transition-layer')?.textContent).toContain('Work')
    expect(stage?.querySelector('.project-rail-transition-layer')).toBeTruthy()
  })

  it('stages the Work nav item in its settled Works state during exit', () => {
    installPage('<section data-testid="real-works"><h1>Works</h1><article>Mighty cover</article></section>', 320)
    installTransitionChrome()
    startProjectEntryTransition({
      event: { button: 0, preventDefault: vi.fn() },
      navigate: vi.fn(),
      project: { slug: 'mighty-demo', title: 'Mighty' },
      worksScrollY: 320,
    })
    document.querySelectorAll('.work-project-transition').forEach((stage) => stage.remove())
    installPage('<section data-testid="project-frame"><h1>Mighty</h1><article>Current gallery frame</article></section>', 2700)
    installTransitionChrome()

    startProjectExitTransition({ navigate: vi.fn(), restoreScrollY: 320 })

    expect(document.querySelector('.sidebar-transition-layer .desktop-nav a[href="/works"]')).toHaveClass('active')
  })
})
