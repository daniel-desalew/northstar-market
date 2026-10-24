import { BrowserRouter, useNavigate } from 'react-router-dom'
import './App.css'
import Footer from './components/layout/Footer.jsx'
import Header from './components/layout/Header.jsx'
import MobileNavigation from './components/layout/MobileNavigation.jsx'
import Navbar from './components/layout/Navbar.jsx'
import AppRoutes from './routes/AppRoutes.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

function Storefront() {
  const navigate = useNavigate()
  return (
    <AuthProvider>
      <div className="storefront">
        <Header onSearch={(query, category) => {
          const params = new URLSearchParams()
          if (query.trim()) params.set('q', query.trim())
          if (category !== 'All') params.set('category', category)
          navigate(`/search${params.size ? `?${params}` : ''}`)
        }} />
        <Navbar />
        <main id="main-content">
          <AppRoutes />
        </main>
        <Footer />
        <MobileNavigation />
      </div>
    </AuthProvider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Storefront />
    </BrowserRouter>
  )
}

export default App
