import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="page-shell page-content not-found">
      <span className="eyebrow">404 — page not found</span>
      <h1>We couldn&apos;t find that page.</h1>
      <p>The link may be out of date, or the page may have moved.</p>
      <Link className="ui-button ui-button--primary" to="/">Return to the home page</Link>
    </section>
  )
}

export default NotFound