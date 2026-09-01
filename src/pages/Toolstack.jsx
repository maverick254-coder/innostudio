import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { usePageAnimation } from '../hooks/usePageAnimation'

const stackGroups = [
  {
    number: '01',
    title: 'Interface',
    description:
      'Composed front-end systems with responsive layouts, motion details, and reusable components.',
    tools: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'Framer Motion', 'GSAP'],
  },
  {
    number: '02',
    title: 'Systems',
    description:
      'Practical back-end foundations for authentication, data, APIs, and deployment-ready workflows.',
    tools: ['C#', '.NET', 'ASP.NET Core', 'Node.js', 'Express', 'REST APIs', 'Entity Framework', 'SQL Server', 'PostgreSQL', 'MongoDB', 'Firebase'],
  },
  {
    number: '03',
    title: 'Design',
    description:
      'Visual direction and product thinking that keep the build focused, consistent, and easy to use.',
    tools: ['Figma', 'Wireframes', 'Prototypes', 'Design Systems', 'Typography', 'Interaction Design', 'Responsive Design', 'Motion Design'],
  },
  {
    number: '04',
    title: 'Delivery',
    description:
      'Tooling and habits that keep projects maintainable from the first commit to the live release.',
    tools: ['Git', 'GitHub', 'Vite', 'Docker', 'Azure', 'Vercel', 'Netlify', 'CI/CD', 'Performance QA'],
  },
]

function Toolstack() {
  const { motion, variants } = usePageAnimation()
  const MotionDiv = motion.div
  const [openStackId, setOpenStackId] = useState(null)

  const panelTransition = {
    duration: 0.36,
    ease: [0.22, 1, 0.36, 1],
  }

  const sectionVariants = {
    initial: { opacity: 0, y: 28 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    initial: { opacity: 0, y: 18 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const toggleStack = (stackId) => {
    setOpenStackId((current) => (current === stackId ? null : stackId))
  }
  
  return (
    <MotionDiv
      id="page-content"
      className="page-content toolstack-page"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      <div className="toolstack-header">
        <div className="toolstack-block">
          <h1 className="toolstack-heading">Toolstack</h1>
          <div className="toolstack-line-row">
            <span className="toolstack-line" aria-hidden="true"></span>
            <p className="toolstack-text">The technologies and frameworks I work with to build modern web solutions.</p>
          </div>
        </div>
      </div>

      <MotionDiv
        className="toolstack-inner"
        variants={sectionVariants}
        initial="initial"
        animate="animate"
      >
        <section className="toolstack-showcase" aria-label="Toolstack overview">
          <MotionDiv className="toolstack-intro" variants={itemVariants}>
            <p className="toolstack-kicker">Selected stack</p>
            <p className="toolstack-description">
              I keep the stack sharp and flexible: enough structure to move with confidence, enough creative room to make each project feel distinct.
            </p>
          </MotionDiv>

          <MotionDiv className="toolstack-image-wrap" variants={itemVariants}>
            <img src="/hub/desk.webp" alt="Developer desk setup" className="toolstack-image" />
          </MotionDiv>
        </section>

        <section className="toolstack-services" aria-label="Technology groups">
          {stackGroups.map((group, index) => {
            const isOpen = openStackId === group.number

            return (
              <MotionDiv key={group.number} variants={itemVariants}>
                {index === 0 && <div className="toolstack-service-separator" />}
                <div className={`toolstack-service-item${isOpen ? ' is-open' : ''}`}>
                  <button
                    type="button"
                    className="toolstack-service-trigger"
                    onClick={() => toggleStack(group.number)}
                    aria-expanded={isOpen}
                    aria-controls={`toolstack-service-panel-${group.number}`}
                  >
                    <span className="toolstack-service-title">{group.title}</span>
                    <span className="toolstack-service-icon" aria-hidden="true">
                      {isOpen ? '-' : '+'}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <MotionDiv
                        id={`toolstack-service-panel-${group.number}`}
                        className="toolstack-service-panel"
                        initial={{ opacity: 0, height: 0, y: -8 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -8 }}
                        transition={panelTransition}
                      >
                        <p>{group.description}</p>
                        <p className="toolstack-tools-text">{group.tools.join(', ')}</p>
                      </MotionDiv>
                    )}
                  </AnimatePresence>
                </div>
                <div className="toolstack-service-separator" />
              </MotionDiv>
            )
          })}
        </section>
      </MotionDiv>
    </MotionDiv>
  )
}

export default Toolstack
