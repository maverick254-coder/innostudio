import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('../utils/projectTransition.js', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    startProjectEntryTransition: vi.fn(({ event }) => {
      event.preventDefault()
    }),
  }
})

import AppRoutes from '../routes/AppRoutes.jsx'
import { startProjectEntryTransition } from '../utils/projectTransition.js'

describe('Works project transition capture', () => {
  afterEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  it('captures the currently visible Works scroll position before opening a project', async () => {
    render(
      <MemoryRouter initialEntries={['/works']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    const scroller = document.querySelector('.page-transition')
    scroller.scrollTop = 640

    const mightyProject = await screen.findByRole('link', { name: /Mighty Demo/i })
    fireEvent.pointerDown(mightyProject, { button: 0 })
    fireEvent.click(mightyProject, { button: 0 })

    expect(startProjectEntryTransition).toHaveBeenCalledWith(
      expect.objectContaining({
        worksScrollY: 640,
      }),
    )
  })

  it('uses the currently visible Works scroll position for keyboard-style activation', async () => {
    render(
      <MemoryRouter initialEntries={['/works']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    const scroller = document.querySelector('.page-transition')
    scroller.scrollTop = 880

    const mightyProject = await screen.findByRole('link', { name: /Mighty Demo/i })
    fireEvent.click(mightyProject, { button: 0 })

    expect(startProjectEntryTransition).toHaveBeenCalledWith(
      expect.objectContaining({
        worksScrollY: 880,
      }),
    )
  })
})
