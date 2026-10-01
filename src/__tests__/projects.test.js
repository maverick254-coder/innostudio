import { describe, expect, it } from 'vitest'
import {
  getProjectShowcaseMedia,
  getNextProject,
  getPreviousProject,
  getProjectBySlug,
  projects,
  validateProjects,
} from '../data/projects.js'

describe('project data model', () => {
  it('defines unique URL-safe slugs for every project', () => {
    const slugs = projects.map((project) => project.slug)

    expect(new Set(slugs).size).toBe(slugs.length)
    expect(slugs).toEqual(['mighty-demo', 'echo-dashboard', 'orbital-commerce', 'foundry-labs', 'north-canvas'])
    slugs.forEach((slug) => {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    })
  })

  it('defines unique IDs for every project', () => {
    const ids = projects.map((project) => project.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('returns a project by slug', () => {
    expect(getProjectBySlug('mighty-demo')).toMatchObject({
      id: 'mighty-demo',
      slug: 'mighty-demo',
      title: 'Mighty',
    })
  })

  it('returns undefined for an unknown slug', () => {
    expect(getProjectBySlug('not-a-project')).toBeUndefined()
  })

  it('preserves all fields required by the Works page cards', () => {
    projects.forEach((project) => {
      expect(project.id).toEqual(expect.any(String))
      expect(project.slug).toEqual(expect.any(String))
      expect(project.title).toEqual(expect.any(String))
      expect(project.cover).toMatchObject({
        src: expect.any(String),
        alt: expect.any(String),
      })
      expect(project.card).toMatchObject({
        variant: expect.stringMatching(/^(large|medium)$/),
      })
    })
  })

  it('defaults media and metadata collections safely', () => {
    projects.forEach((project) => {
      expect(Array.isArray(project.media)).toBe(true)
      expect(Array.isArray(project.metadata.roles)).toBe(true)
      expect(Array.isArray(project.metadata.technologies)).toBe(true)
    })
  })

  it('provides previous and next project helpers for future navigation', () => {
    expect(getPreviousProject('mighty-demo')?.slug).toBe('north-canvas')
    expect(getNextProject('mighty-demo')?.slug).toBe('echo-dashboard')
    expect(getPreviousProject('not-a-project')).toBeUndefined()
    expect(getNextProject('not-a-project')).toBeUndefined()
  })

  it('normalizes Mighty Demo showcase media from reusable desktop/mobile page pairs', () => {
    const mightyDemo = getProjectBySlug('mighty-demo')
    const media = getProjectShowcaseMedia(mightyDemo)

    expect(mightyDemo.cover.kind).toBe('mighty-system')
    expect(mightyDemo.showcaseBeats).toBeUndefined()
    expect(mightyDemo.showcase).toBeUndefined()
    expect(mightyDemo.showcasePages.map((page) => page.id)).toEqual(['home', 'about', 'services'])
    expect(media.map((item) => `${item.pageId}:${item.view}`)).toEqual([
      'home:desktop',
      'home:mobile',
      'about:desktop',
      'about:mobile',
      'services:desktop',
      'services:mobile',
    ])
    expect(media.map((item) => item.type)).toEqual(['desktop', 'mobile', 'desktop', 'mobile', 'desktop', 'mobile'])
    media.forEach((item) => {
      expect(item.src).toMatch(/^\/projects\/mighty\/(?:home|about|services)-(?:desktop|mobile)\.webp$/)
      expect(item.alt).toEqual(expect.any(String))
      expect(item.width).toEqual(expect.any(Number))
      expect(item.height).toEqual(expect.any(Number))
      expect(item.aspectRatio).toBe(`${item.width} / ${item.height}`)
      expect(item.artwork).toBeUndefined()
      expect(item.kind).toBe('interface-screen')
    })
  })

  it('validates declared showcase views but allows future single-view pages', () => {
    const incompleteFutureProject = {
      id: 'future',
      slug: 'future',
      title: 'Future',
      cover: { src: '/future.png', alt: 'Future project' },
      card: { variant: 'medium' },
      media: [],
      metadata: { roles: [], technologies: [] },
    }
    const missingMobileShowcase = {
      ...incompleteFutureProject,
      id: 'broken',
      slug: 'broken',
      showcasePages: [
        {
          id: 'home',
          label: 'Home',
          desktop: { src: '/home.png', alt: 'Home', width: 1440 },
        },
      ],
    }
    const singleViewShowcase = {
      ...incompleteFutureProject,
      id: 'single',
      slug: 'single',
      showcasePages: [
        {
          id: 'home',
          label: 'Home',
          desktop: { src: '/home.png', alt: 'Home', width: 1440, height: 900 },
        },
      ],
    }

    expect(() => validateProjects([incompleteFutureProject])).not.toThrow()
    expect(() => validateProjects([singleViewShowcase])).not.toThrow()
    expect(() => validateProjects([missingMobileShowcase])).toThrow(/desktop/)
  })
})
