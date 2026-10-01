import { describe, expect, it } from 'vitest'
import { resolveProjectMediaWidth } from '../pages/Project.jsx'

describe('project media sizing', () => {
  it('uses page role widths only for desktop page-pair media', () => {
    expect(resolveProjectMediaWidth({ type: 'desktop', view: 'desktop', role: 'home' })).toBe('clamp(680px, 56vw, 900px)')
    expect(resolveProjectMediaWidth({ type: 'desktop', view: 'desktop', role: 'about' })).toBe('clamp(680px, 56vw, 900px)')
  })

  it('uses mobile sizing for mobile page-pair media even when the page role has a desktop width', () => {
    expect(resolveProjectMediaWidth({ type: 'mobile', view: 'mobile', role: 'home' })).toBe(
      'calc(clamp(520px, 70vh, 680px) * var(--media-ratio))',
    )
    expect(resolveProjectMediaWidth({ type: 'mobile', view: 'mobile', role: 'about' })).toBe(
      'calc(clamp(520px, 70vh, 680px) * var(--media-ratio))',
    )
    expect(resolveProjectMediaWidth({ type: 'mobile', view: 'mobile', role: 'services' })).toBe(
      'calc(clamp(520px, 70vh, 680px) * var(--media-ratio))',
    )
  })

  it('lets explicit media width overrides win over role and view defaults', () => {
    expect(resolveProjectMediaWidth({ type: 'mobile', view: 'mobile', role: 'home', widthOverride: '312px' })).toBe('312px')
    expect(resolveProjectMediaWidth({ type: 'desktop', view: 'desktop', role: 'home', widthOverride: '920px' })).toBe('920px')
  })
})
