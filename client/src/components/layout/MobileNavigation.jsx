import { Heart, Home, ShoppingBag, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

function MobileNavigation() {
  return (
    <nav className="mobile-navigation" aria-label="Quick links">
      <NavLink to="/"><Home size={19} /><span>Home</span></NavLink>
      <NavLink to="/products"><ShoppingBag size={19} /><span>Shop</span></NavLink>
      <NavLink to="/wishlist"><Heart size={19} /><span>Saved</span></NavLink>
      <NavLink to="/profile"><UserRound size={19} /><span>Account</span></NavLink>
    </nav>
  )
}

export default MobileNavigation