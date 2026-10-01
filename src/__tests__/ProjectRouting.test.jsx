import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import AppRoutes from '../routes/AppRoutes.jsx'

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>
  )
}

describe('project routing', () => {
  it('renders a project detail page from a direct /work/:slug URL', async () => {
    const { container } = renderAt('/work/mighty-demo')

    expect(await screen.findByRole('heading', { name: 'Mighty' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close project' })).toHaveClass('magnetic-button')
    expect(screen.getByRole('region', { name: 'Project information' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Mighty media showcase' })).toBeInTheDocument()

    const showcaseItems = [...container.querySelectorAll('.project-media-item')]
    expect(showcaseItems.map((item) => `${item.dataset.pageId}:${item.dataset.mediaView}`)).toEqual([
      'home:desktop',
      'home:mobile',
      'about:desktop',
      'about:mobile',
      'services:desktop',
      'services:mobile',
    ])
    expect(showcaseItems.map((item) => item.dataset.mediaType)).toEqual(['desktop', 'mobile', 'desktop', 'mobile', 'desktop', 'mobile'])
    expect(container.querySelectorAll('.project-media-image')).toHaveLength(6)
    expect(container.querySelector('.demo-artwork')).toBeNull()

    const images = [...container.querySelectorAll('.project-media-image')]
    expect(images[0]).toHaveAttribute('src', '/projects/mighty/home-desktop.webp')
    expect(images[0]).toHaveAttribute('width', '1440')
    expect(images[0]).toHaveAttribute('height', '900')
    expect(images[1]).toHaveAttribute('src', '/projects/mighty/home-mobile.webp')
    expect(images[1]).toHaveAttribute('width', '390')
    expect(images[1]).toHaveAttribute('height', '844')
  })

  it('renders the existing not found state for an unknown project slug', async () => {
    renderAt('/work/not-a-project')

    expect(await screen.findByRole('heading', { name: 'Page Not Found' })).toBeInTheDocument()
  })

  it('links Works project cards to their project routes', async () => {
    renderAt('/works')

    const mightyProject = await screen.findByRole('link', { name: /Mighty Demo/i })

    expect(mightyProject).toHaveAttribute('href', '/work/mighty-demo')
  })
})
