const createProject = ({
  id,
  slug,
  title,
  cover,
  card,
  tagline = null,
  metadata = {},
  description = '',
  externalUrl = null,
  media = [],
  showcasePages = null,
  extras = [],
}) => {
  const project = {
    id,
    slug,
    title,
    tagline,
    cover,
    card,
    metadata: {
      ...metadata,
      roles: metadata.roles || [],
      client: metadata.client || title,
      year: metadata.year || null,
      agency: metadata.agency || null,
      technologies: metadata.technologies || [],
    },
    description,
    externalUrl,
    showcasePages,
    extras,
    media: [],
  }

  project.media = media.length
    ? media.map((item) => ({ kind: 'interface-screen', ...item }))
    : getProjectShowcaseMedia(project)

  if (!showcasePages) {
    delete project.showcasePages
  }

  if (!extras.length) {
    delete project.extras
  }

  return project
}

const REQUIRED_SHOWCASE_VIEWS = ['desktop', 'mobile']
const ALLOWED_SHOWCASE_TYPES = ['desktop', 'mobile', 'portrait', 'landscape']

function normalizeShowcaseItem(project, item, context = {}) {
  if (!item) return null

  const { pageId = null, pageLabel = null, view = null, role = view || 'extra', index = 0 } = context

  return {
    kind: 'interface-screen',
    id: item.id || `${project.id}-${pageId || role}-${view || index + 1}`,
    role,
    pageId,
    pageLabel,
    view,
    src: item.src,
    alt: item.alt,
    type: item.type || view,
    width: item.width,
    height: item.height,
    aspectRatio: item.aspectRatio || (item.width && item.height ? `${item.width} / ${item.height}` : undefined),
    tone: item.tone || 'light',
    offsetY: item.offsetY,
    widthOverride: item.widthOverride,
  }
}

export function getProjectShowcaseMedia(project) {
  if (!project?.showcasePages) return []

  const pageMedia = project.showcasePages.flatMap((page) =>
    REQUIRED_SHOWCASE_VIEWS
      .map((view) => normalizeShowcaseItem(project, page[view], {
        pageId: page.id,
        pageLabel: page.label,
        view,
        role: page.id,
      }))
      .filter(Boolean),
  )
  const extras = (project.extras || [])
    .map((item, index) => normalizeShowcaseItem(project, item, { role: 'extra', index }))
    .filter(Boolean)

  return [...pageMedia, ...extras]
}

export const projects = [
  createProject({
    id: 'mighty-demo',
    slug: 'mighty-demo',
    title: 'Mighty',
    tagline: 'Digital experiences built with an unreasonable amount of care.',
    cover: {
      src: '/hub/work-land.png',
      alt: 'Mighty Demo project preview',
      kind: 'mighty-system',
    },
    card: {
      variant: 'large',
    },
    metadata: {
      roles: ['Creative Development', 'Frontend Development', 'Interaction Design'],
      client: 'Mighty Demo',
      year: '2026',
      type: 'Digital Experience',
    },
    description:
      'Mighty Demo is a fictional digital studio case study created to prove the portfolio showcase system before real client assets are added. The project imagines a brand that builds editorial websites, cultural campaigns, and product stories with a sharp visual rhythm. Its interface language moves between warm yellow, soft pink, black, and off-white compositions, giving the showcase enough contrast to test hero pacing, project context, dense media, portrait screens, and wide cinematic moments.',
    showcasePages: [
      {
        id: 'home',
        label: 'Home',
        desktop: {
          id: 'mighty-demo-home',
          src: '/projects/mighty/home-desktop.webp',
          alt: 'Mighty Demo home page desktop view',
          width: 1440,
          height: 900,
          tone: 'bright',
          offsetY: '0vh',
        },
        mobile: {
          id: 'mighty-demo-home-mobile',
          src: '/projects/mighty/home-mobile.webp',
          alt: 'Mighty Demo home page mobile view',
          width: 390,
          height: 844,
          tone: 'bright',
          offsetY: '0vh',
        },
      },
      {
        id: 'about',
        label: 'About',
        desktop: {
          id: 'mighty-demo-about',
          src: '/projects/mighty/about-desktop.webp',
          alt: 'Mighty Demo about page desktop view',
          width: 1440,
          height: 900,
          tone: 'light',
          offsetY: '0vh',
        },
        mobile: {
          id: 'mighty-demo-about-mobile',
          src: '/projects/mighty/about-mobile.webp',
          alt: 'Mighty Demo about page mobile view',
          width: 390,
          height: 844,
          tone: 'light',
          offsetY: '0vh',
        },
      },
      {
        id: 'services',
        label: 'Services',
        desktop: {
          id: 'mighty-demo-services',
          src: '/projects/mighty/services-desktop.webp',
          alt: 'Mighty Demo services page desktop view',
          width: 1440,
          height: 900,
          tone: 'dark',
          offsetY: '0vh',
        },
        mobile: {
          id: 'mighty-demo-services-mobile',
          src: '/projects/mighty/services-mobile.webp',
          alt: 'Mighty Demo services page mobile view',
          width: 390,
          height: 844,
          tone: 'dark',
          offsetY: '0vh',
        },
      },
    ],
  }),
  createProject({
    id: 'echo-dashboard',
    slug: 'echo-dashboard',
    title: 'Echo Dashboard',
    cover: {
      src: '/hub/work-land.png',
      alt: 'Echo Dashboard project preview',
    },
    card: {
      variant: 'large',
    },
  }),
  createProject({
    id: 'orbital-commerce',
    slug: 'orbital-commerce',
    title: 'Orbital Commerce',
    cover: {
      src: '/hub/background-texture.png',
      alt: 'Orbital Commerce project preview',
    },
    card: {
      variant: 'medium',
    },
  }),
  createProject({
    id: 'foundry-labs',
    slug: 'foundry-labs',
    title: 'Foundry Labs',
    cover: {
      src: '/hub/background-texture.png',
      alt: 'Foundry Labs project preview',
    },
    card: {
      variant: 'medium',
    },
  }),
  createProject({
    id: 'north-canvas',
    slug: 'north-canvas',
    title: 'North Canvas',
    cover: {
      src: '/hub/work-land.png',
      alt: 'North Canvas project preview',
    },
    card: {
      variant: 'large',
    },
  }),
]

export function validateProjects(projectList = projects) {
  const ids = new Set()
  const slugs = new Set()

  projectList.forEach((project) => {
    if (!project.id) {
      throw new Error('Project is missing an id.')
    }

    if (ids.has(project.id)) {
      throw new Error(`Duplicate project id: ${project.id}`)
    }

    ids.add(project.id)

    if (!project.slug) {
      throw new Error(`Project "${project.id}" is missing a slug.`)
    }

    if (slugs.has(project.slug)) {
      throw new Error(`Duplicate project slug: ${project.slug}`)
    }

    slugs.add(project.slug)

    if (!project.title) {
      throw new Error(`Project "${project.id}" is missing a title.`)
    }

    if (!project.cover?.src || !project.cover?.alt) {
      throw new Error(`Project "${project.id}" is missing cover information.`)
    }

    if (!Array.isArray(project.media)) {
      throw new Error(`Project "${project.id}" media must be an array.`)
    }

    if (project.showcasePages) {
      if (!Array.isArray(project.showcasePages)) {
        throw new Error(`Project "${project.id}" showcasePages must be an array.`)
      }

      project.showcasePages.forEach((page, pageIndex) => {
        if (!page?.id || !page?.label) {
          throw new Error(`Project "${project.id}" showcase page ${pageIndex + 1} is missing id or label.`)
        }

        const declaredViews = REQUIRED_SHOWCASE_VIEWS.filter((view) => page[view])

        if (!declaredViews.length) {
          throw new Error(`Project "${project.id}" showcase page "${page.id}" is missing media.`)
        }

        declaredViews.forEach((view) => {
          const item = page[view]

          if (!item?.src || !item?.alt || !Number.isFinite(item.width) || !Number.isFinite(item.height)) {
            throw new Error(`Project "${project.id}" showcase page "${page.id}" is missing ${view} media.`)
          }
        })
      })
    }

    if (project.extras && !Array.isArray(project.extras)) {
      throw new Error(`Project "${project.id}" extras must be an array.`)
    }

    ;(project.extras || []).forEach((item, index) => {
      if (!item?.src || !item?.alt || !item?.type || !Number.isFinite(item.width) || !Number.isFinite(item.height)) {
        throw new Error(`Project "${project.id}" showcase extra ${index + 1} is incomplete.`)
      }

      if (!ALLOWED_SHOWCASE_TYPES.includes(item.type)) {
        throw new Error(`Project "${project.id}" showcase extra ${index + 1} has unsupported type "${item.type}".`)
      }
    })
  })
}

validateProjects(projects)

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug)
}

export function getProjectIndex(slug) {
  return projects.findIndex((project) => project.slug === slug)
}

export function getNextProject(slug) {
  const index = getProjectIndex(slug)

  if (index === -1) return undefined

  return projects[(index + 1) % projects.length]
}

export function getPreviousProject(slug) {
  const index = getProjectIndex(slug)

  if (index === -1) return undefined

  return projects[(index - 1 + projects.length) % projects.length]
}
