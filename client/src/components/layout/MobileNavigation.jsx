import { Heart, Home, Lightbulb, Paintbrush, Shirt, ShoppingBag, Utensils, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

function MobileNavigation() {
  return (
    <nav className="mobile-navigation" aria-label="Quick links">
      <NavLink to="/"><Home size={19} /><span>Home</span></NavLink>
      <NavLink to="/products"><ShoppingBag size={19} /><span>Shop</span></NavLink>
      <NavLink to="/categories/Electronics?department=Amazon%20Smart%20Home"><Lightbulb size={19} /><span>Smart Home</span></NavLink>
      <NavLink to="/categories/Arts%20%26%20Crafts"><Paintbrush size={19} /><span>Arts &amp; Crafts</span></NavLink>
      <NavLink to="/categories/Home%20%26%20Kitchen"><Utensils size={19} /><span>Home &amp; Kitchen</span></NavLink>
      <NavLink to="/categories/Fashion"><Shirt size={19} /><span>Men&apos;s Fashion</span></NavLink>
      <NavLink to="/wishlist"><Heart size={19} /><span>Saved</span></NavLink>
      <NavLink to="/profile"><UserRound size={19} /><span>Account</span></NavLink>
    </nav>
  )
}

export default MobileNavigation