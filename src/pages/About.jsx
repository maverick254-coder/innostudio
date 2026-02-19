import { usePageAnimation } from '../hooks/usePageAnimation'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

const serviceItems = [
  {
    id: 'design',
    title: 'Design',
    details:
      'I shape interface systems with strong visual hierarchy, clean typography, and interaction patterns that make complex ideas feel simple and intuitive.',
  },
  {
    id: 'development',
    title: 'Development',
    details:
      'I build performant front-end and back-end solutions with maintainable architecture, scalable components, and production-ready implementation from concept to launch.',
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    details:
      'I provide continuous optimization, bug fixing, and feature iteration to keep products stable, secure, and aligned with changing user and business needs.',
  },
]

function About() {
  const { motion, variants } = usePageAnimation()
  const [openServiceId, setOpenServiceId] = useState(null)
  const hasOpenService = openServiceId !== null

  const rowTransition = {
    layout: { type: 'spring', stiffness: 140, damping: 26, mass: 0.8 },
    duration: 0.42,
    ease: [0.22, 1, 0.36, 1],
  }

  const panelTransition = {
    layout: { type: 'spring', stiffness: 180, damping: 22, mass: 0.75 },
    duration: 0.36,
    ease: [0.22, 1, 0.36, 1],
  }

  const toggleService = (serviceId) => {
    setOpenServiceId((current) => (current === serviceId ? null : serviceId))
  }
  
  return (
    <motion.div
      id="page-content"
      className="page-content about-page"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      <div className="about-header">
        <div className="about-block">
          <h1 className="about-heading">About</h1>
          <div className="about-line-row">
            <span className="about-line" aria-hidden="true"></span>
            <p className="about-text">A little bit about me.</p>
          </div>
        </div>
      </div>

      <div className="about-inner">
        <div className="about-columns">
          {/* Left Column */}
          <div className="about-intro">
            <p className="about-intro-text">
              I'm a creative developer with a passion for building intuitive digital experiences. I love working with modern technologies and pushing the boundaries of what's possible on the web.
            </p>
            <Link to="/contact" className="say-hello-link">
              <span className="line-accent"></span>
              Say Hello
            </Link>
          </div>

          {/* Right Column */}
          <div className="about-content">
            <p className="about-paragraph about-paragraph-main">
              With over 5 years of experience in web development, I've had the opportunity to work on diverse projects ranging from small startups to larger enterprises. I specialize in creating responsive, performant, and visually appealing websites and applications.
            </p>
            <p className="about-paragraph">
              My approach combines technical expertise with creative thinking. I believe in writing clean, maintainable code while ensuring every pixel aligns with the design vision. From front-end frameworks to backend architecture, I enjoy solving complex problems and delivering solutions that exceed expectations.
            </p>
            <p className="about-paragraph">
              When I'm not coding, you can find me exploring new design trends, contributing to open-source projects, or helping other developers grow their skills. Let's create something amazing together!
            </p>

            <div className="about-services" aria-label="Service details">
              {serviceItems.map((service, index) => {
                const isOpen = openServiceId === service.id
                const isHidden = hasOpenService && !isOpen

                return (
                  <motion.div 
                    key={service.id}
                    layout
                    transition={rowTransition}
                  >
                    {index === 0 && <div className="about-service-separator" />}
                    <motion.div
                      className={`about-service-item${isOpen ? ' is-open' : ''}${isHidden ? ' is-hidden' : ''}`}
                      layout
                      initial={false}
                      animate={
                        isHidden
                          ? { opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }
                          : { opacity: 1, height: 'auto', marginTop: 0, marginBottom: 0 }
                      }
                      transition={rowTransition}
                    >
                      <button
                        type="button"
                        className="about-service-trigger"
                        onClick={() => toggleService(service.id)}
                        aria-expanded={isOpen}
                        aria-controls={`about-service-panel-${service.id}`}
                      >
                        <span className="about-service-title">{service.title}</span>
                        <span className="about-service-icon" aria-hidden="true">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`about-service-panel-${service.id}`}
                            className="about-service-panel"
                            layout
                            initial={{ opacity: 0, height: 0, y: -8 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -8 }}
                            transition={panelTransition}
                          >
                            <p>{service.details}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <motion.div 
                      className="about-service-separator"
                      layout
                    />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default About
