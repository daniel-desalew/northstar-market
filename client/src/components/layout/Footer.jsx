import { ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <a className="footer-top" href="#top">
        Back to top <ArrowUp size={15} aria-hidden="true" />
      </a>
      <div className="footer-content">
        <section className="footer-about">
          <h3>Northstar Market</h3>
          <p>
            Thoughtful finds for everyday living. A sample storefront built as
            part of the AmazonStore learning project.
          </p>
        </section>
        <section>
          <h3>Get to know us</h3>
          <Link to="/about">About Northstar</Link>
          <Link to="/products">Shop all</Link>
          <Link to="/wishlist">Saved items</Link>
        </section>
        <section>
          <h3>Let us help</h3>
          <Link to="/profile">Your account</Link>
          <Link to="/orders">Order tracking</Link>
          <Link to="/help">Help center</Link>
        </section>
        <section>
          <h3>Shopping with us</h3>
          <Link to="/shipping">Shipping information</Link>
          <Link to="/returns">Returns</Link>
          <Link to="/privacy">Privacy</Link>
        </section>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Northstar Market. Demo storefront for
        learning purposes.
      </div>
    </footer>
  )
}

export default Footer