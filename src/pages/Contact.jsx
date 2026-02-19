import { usePageAnimation } from '../hooks/usePageAnimation'

function Contact() {
  const { motion, variants } = usePageAnimation()
  
  return (
    <motion.div
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
    </motion.div>
  )
}

export default Contact
