import { ChevronDown, Menu, UserCircle, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { categories } from '../../data/sampleProducts.js'

const digitalServices = [
  { name: 'Prime Video', description: 'Watch films and shows in this store', to: '/digital/video' },
  { name: 'Amazon Music', description: 'Listen to music in this store', to: '/digital/music' },
  { name: 'Kindle', description: 'Explore books and reading', to: '/digital/kindle' },
  { name: 'Amazon Appstore', description: 'Browse apps in this store', to: '/digital/appstore' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const [showAllDepartments, setShowAllDepartments] = useState(false)
  const closeMenu = () => setOpen(false)
  const departments = [
    { name: 'Electronics', to: '/categories/Electronics' },
    { name: 'Computers', to: '/categories/Electronics' },
    { name: 'Smart Home', to: '/categories/Electronics' },
    { name: 'Arts & Crafts', to: '/categories/Books' },
  ]
  const moreDepartments = categories.filter(({ name }) => !departments.some((department) => department.name === name))
  const programs = [
    { name: 'Gift Cards', description: 'Browse the project store', to: '/products' },
    { name: 'Amazon Live', description: 'Watch videos in this project', to: '/digital/video' },
    { name: 'International Shopping', description: 'Browse products available in this project', to: '/products' },
    { name: 'Amazon Second Chance', description: 'Explore more project products', to: '/products' },
  ]

  return (
    <>
      <nav className="desktop-nav" aria-label="Product categories">
        <div className="nav-inner">
          <button className="nav-link nav-all-link" type="button" aria-expanded={open} onClick={() => setOpen(true)}>
            <Menu size={18} strokeWidth={2.5} aria-hidden="true" />
            <span>All</span>
          </button>
          {categories.map((category) => (
            <NavLink
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              key={category.name}
              to={`/categories/${encodeURIComponent(category.name)}`}
            >
              {category.name}
            </NavLink>
          ))}
          <Link className="nav-link" to="/products?sort=popular">Today&apos;s finds</Link>
        </div>
      </nav>
      {open && (
        <div className="menu-backdrop" onClick={closeMenu}>
          <aside className="menu-drawer" aria-label="Main menu" onClick={event => event.stopPropagation()}>
            <div className="menu-drawer-header">
              <Link to="/login" className="menu-greeting" onClick={closeMenu}>
                <UserCircle size={25} aria-hidden="true" />
                <span>Hello, sign in</span>
              </Link>
              <button className="menu-close" type="button" aria-label="Close menu" onClick={closeMenu}><X /></button>
            </div>

            <section className="menu-section menu-digital">
              <h2>Digital Content &amp; Devices</h2>
              {digitalServices.map(({ name, description, to }) => (
                <Link className="menu-service" key={name} to={to} onClick={closeMenu}>
                  <span>{name}<small>{description}</small></span>
                  <ChevronDown className="menu-service-arrow" size={16} aria-hidden="true" />
                </Link>
              ))}
            </section>

            <section className="menu-section">
              <h2>Shop by Department</h2>
              {departments.map(({ name, to }) => (
                <Link key={name} to={to} onClick={closeMenu}>{name}</Link>
              ))}
              {showAllDepartments && moreDepartments.map(({ name }) => (
                <Link key={name} to={`/categories/${encodeURIComponent(name)}`} onClick={closeMenu}>{name}</Link>
              ))}
              <button className="menu-see-all" type="button" aria-expanded={showAllDepartments} onClick={() => setShowAllDepartments((expanded) => !expanded)}>
                {showAllDepartments ? 'See less' : 'See all'} <ChevronDown className={showAllDepartments ? 'is-expanded' : ''} size={16} aria-hidden="true" />
              </button>
            </section>

            <section className="menu-section">
              <h2>Programs &amp; Features</h2>
              {programs.map(({ name, description, to }) => (
                <Link className="menu-program" key={name} to={to} onClick={closeMenu}><span>{name}<small>{description}</small></span><span aria-hidden="true">›</span></Link>
              ))}
            </section>

            <section className="menu-section">
              <h2>Help &amp; Settings</h2>
              <Link to="/profile" onClick={closeMenu}>Your Account</Link>
              <Link to="/profile" onClick={closeMenu}>◎ &nbsp; English</Link>
              <Link to="/profile" onClick={closeMenu}>🇪🇹 &nbsp; Ethiopia</Link>
              <Link to="/profile" onClick={closeMenu}>Customer Service</Link>
              <Link to="/login" onClick={closeMenu}>Sign in</Link>
            </section>
          </aside>
        </div>
      )}
    </>
  )
}

export default Navbar







