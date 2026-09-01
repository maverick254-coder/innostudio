import { useState } from 'react'
import { usePageAnimation } from '../hooks/usePageAnimation'

const contactEndpoint = '/api/contact'

function Contact() {
  const { motion, variants } = usePageAnimation()
  const MotionDiv = motion.div
  const [submitState, setSubmitState] = useState('idle')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name')?.toString().trim()
    const email = formData.get('email')?.toString().trim()
    const message = formData.get('message')?.toString().trim()
    const company = formData.get('company')?.toString().trim()

    if (company) return

    setSubmitState('sending')

    try {
      const response = await fetch(contactEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          company,
        }),
      })

      if (!response.ok) {
        throw new Error('Contact form request failed')
      }

      event.currentTarget.reset()
      setSubmitState('sent')
    } catch {
      setSubmitState('error')
    }
  }
  
  return (
    <MotionDiv
      id="page-content"
      className="page-content contact-page"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      <div className="contact-header">
        <div className="contact-block">
          <h1 className="contact-heading">Contact</h1>
          <div className="contact-line-row">
            <span className="contact-line" aria-hidden="true"></span>
            <p className="contact-text">Let's connect and create something amazing together.</p>
          </div>
        </div>
      </div>

      <div className="contact-inner">
        <section className="contact-form-section" aria-label="Contact form">
          <div className="contact-form-intro">
            <p className="contact-kicker">Start a conversation</p>
            <p className="contact-description">
              Share your name and email. I&apos;ll pick it up from there.
            </p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="company"
              className="contact-honey"
              tabIndex="-1"
              autoComplete="off"
              aria-hidden="true"
            />

            <label className="contact-field">
              <span>Name</span>
              <input type="text" name="name" autoComplete="name" required />
            </label>

            <label className="contact-field">
              <span>Email</span>
              <input type="email" name="email" autoComplete="email" required />
            </label>

            <label className="contact-field contact-message-field">
              <span>Message</span>
              <textarea name="message" rows="5" required></textarea>
            </label>

            <button type="submit" className="contact-submit" disabled={submitState === 'sending'}>
              {submitState === 'sending' ? 'Sending' : 'Submit'}
            </button>

            <p className="contact-status" aria-live="polite">
              {submitState === 'sent' && 'Message sent. I will get back to you soon.'}
              {submitState === 'error' && 'Something went wrong. Please try again.'}
            </p>
          </form>
        </section>
      </div>
    </MotionDiv>
  )
}

export default Contact
