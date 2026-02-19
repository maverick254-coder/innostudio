import { usePageAnimation } from '../hooks/usePageAnimation'

function Works() {
  const { motion, variants } = usePageAnimation()
  
  return (
    <motion.div
      id="page-content"
      className="page-content works-page"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      <div className="works-header">
        <div className="works-block">
          <h1 className="works-heading">Works</h1>
          <div className="works-line-row">
            <span className="works-line" aria-hidden="true"></span>
            <p className="works-text">A showcase of my projects and experiments.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Works
