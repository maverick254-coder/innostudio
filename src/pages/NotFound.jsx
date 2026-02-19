import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div id="page-content" className="page-content page-container">
      <div className="text-container">
        <h1>Page Not Found</h1>
        <p className="small-line">The page you are looking for does not exist.</p>
        <div className="button-container">
          <Link className="view-more-btn" to="/">Go Home</Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
