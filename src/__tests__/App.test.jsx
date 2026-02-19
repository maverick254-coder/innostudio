import { render, screen } from '@testing-library/react'
import App from '../App.jsx'

describe('App routing', () => {
  it('shows not found for unknown routes', () => {
    window.history.pushState({}, 'Test page', '/does-not-exist')
    render(<App />)
    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
  })
})
