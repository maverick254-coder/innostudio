import React from 'react'
import { act, cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AppRoutes from '../routes/AppRoutes.jsx'

describe('App routing', () => {
  afterEach(() => {
    vi.useRealTimers()
    cleanup()
    document.body.className = ''
  })

  it('mounts one persistent site atmosphere outside route content', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/works']}>
        <AppRoutes />
      </MemoryRouter>
    )

    const atmosphere = container.querySelectorAll('.site-atmosphere')

    expect(atmosphere).toHaveLength(1)
    expect(container.querySelector('#page-content .site-atmosphere')).not.toBeInTheDocument()
    expect(container.querySelector('.site-atmosphere__wash')).not.toBeInTheDocument()
    expect(container.querySelector('.site-atmosphere__dots')).toBeInTheDocument()
  })

  it('keeps the scroll rail outside the sidebar so project mode can move the sidebar independently', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/work/mighty-demo']}>
        <AppRoutes />
      </MemoryRouter>
    )

    const rail = container.querySelector('.project-scroll-rail')
    const sidebar = container.querySelector('.sidebar')

    expect(rail).toBeInTheDocument()
    expect(rail).toHaveClass('project-scroll-rail--project-mode')
    expect(sidebar).toHaveClass('sidebar--project-mode')
    expect(sidebar?.contains(rail)).toBe(false)
  })

  it('shows not found for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/does-not-exist']}>
        <AppRoutes />
      </MemoryRouter>
    )

    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
  })

  it('mounts the intro loader at layout level on direct route loads', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <AppRoutes />
      </MemoryRouter>
    )

    expect(document.querySelector('.site-loader')).toBeInTheDocument()
    expect(document.querySelector('.site-loader-mark__ghost')).toHaveAttribute('src', '/favicon.svg')
    expect(document.querySelector('.site-loader-mark__fill')).toHaveAttribute('src', '/favicon.svg')
    expect(document.querySelector('#page-content .site-loader')).not.toBeInTheDocument()
    expect(document.querySelector('.loading-screen')).not.toBeInTheDocument()
    expect(document.body).toHaveClass('site-loader-active')
  })

  it('keeps the loader fill logo independent from any animated sizing wrapper', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <AppRoutes />
      </MemoryRouter>
    )

    const fillLogo = document.querySelector('.site-loader-mark__fill')

    expect(fillLogo).toBeInTheDocument()
    expect(fillLogo?.parentElement).toHaveClass('site-loader-mark')
    expect(document.querySelector('.site-loader-mark__mask')).not.toBeInTheDocument()
  })

  it('removes the intro loader after the app-level intro completes without unmounting the route', () => {
    vi.useFakeTimers()

    render(
      <MemoryRouter initialEntries={['/works']}>
        <AppRoutes />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Works' })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(2600)
    })

    expect(document.querySelector('.site-loader')).not.toBeInTheDocument()
    expect(document.body).not.toHaveClass('site-loader-active')
    expect(screen.getByRole('heading', { name: 'Works' })).toBeInTheDocument()
  })
})
