import { usePageAnimation } from '../hooks/usePageAnimation'

function Toolstack() {
  const { motion, variants } = usePageAnimation()
  
  return (
    <motion.div
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
    </motion.div>
  )
}

export default Toolstack
