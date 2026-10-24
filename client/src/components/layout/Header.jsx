import { ArrowDown, MapPin, ShoppingBag, Store } from 'lucide-react'
import { Link } from 'react-router-dom'
import CartCount from '../cart/CartCount.jsx'
import SearchBar from './SearchBar.jsx'

function Header({ onSearch }) {
  return (
    <header className="site-header">
      <div className="header-main">
        <Link className="brand" to="/" aria-label="Northstar Market home">
          <span className="brand-mark">
            <Store size={22} strokeWidth={2.3} />
          </span>
          <span>
            <span className="brand-name">Northstar</span>
            <span className="brand-caption">Market & more</span>
          </span>
        </Link>

        <div className="delivery">
          <MapPin size={17} aria-hidden="true" />
          <span>
            Delivering to
            <strong>Addis Ababa, Ethiopia</strong>
          </span>
        </div>

        <SearchBar onSearch={onSearch} />

        <Link className="header-link" to="/login">
          Hello, guest
          <strong>Account <ArrowDown size={12} aria-hidden="true" /></strong>
        </Link>
        <Link className="header-link" to="/orders">
          Find
          <strong>Your orders</strong>
        </Link>
        <Link className="header-cart" to="/cart" aria-label="Shopping cart">
          <span className="cart-count"><CartCount /></span>
          <ShoppingBag size={25} aria-hidden="true" />
          <strong>Cart</strong>
        </Link>
      </div>
    </header>
  )
}

export default Header
