import { ArrowRight, Headphones, PackageCheck, ShieldCheck, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories, sampleProducts } from '../data/sampleProducts.js'
import ProductGrid from '../components/products/ProductGrid.jsx'

function Home() {
  return (
    <div id="top">
      <div className="page-shell">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <span className="eyebrow">Good things, thoughtfully found</span>
            <h1 id="hero-title">A little more joy in every day.</h1>
            <p>
              Discover everyday essentials and one-of-a-kind favorites, picked
              to make life feel a little brighter.
            </p>
            <a className="primary-link" href="#products">
              Explore the collection <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="service-strip" aria-label="Store benefits">
          <div className="service-item">
            <span className="service-icon"><Truck size={21} /></span>
            <span><strong>Shipping made simple</strong><span>On qualifying orders</span></span>
          </div>
          <div className="service-item">
            <span className="service-icon"><ShieldCheck size={21} /></span>
            <span><strong>Shop with confidence</strong><span>Secure checkout experience</span></span>
          </div>
          <div className="service-item">
            <span className="service-icon"><PackageCheck size={21} /></span>
            <span><strong>Easy order updates</strong><span>Stay in the know</span></span>
          </div>
          <div className="service-item">
            <span className="service-icon"><Headphones size={21} /></span>
            <span><strong>Here to help</strong><span>Friendly customer care</span></span>
          </div>
        </section>

        <section className="section" aria-labelledby="categories-title">
          <div className="section-heading">
            <div>
              <h2 id="categories-title">Find your kind of something</h2>
              <p>Explore a few of our favorite departments</p>
            </div>
            <a className="text-link" href="#products">
              Browse all <ArrowRight size={14} />
            </a>
          </div>
          <div className="category-grid">
            {categories.map((item) => (
              <Link
                className="category-card"
                key={item.name}
                to={`/categories/${encodeURIComponent(item.name)}`}
                style={{ backgroundImage: `url("${item.image}")` }}
              >
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="section" id="products" aria-labelledby="products-title">
          <div className="section-heading">
            <div>
              <h2 id="products-title">Popular right now</h2>
              <p>
                {sampleProducts.length} handpicked finds to explore
              </p>
            </div>
            <a className="text-link" href="#offers">
              See today&apos;s finds <ArrowRight size={14} />
            </a>
          </div>
          <ProductGrid products={sampleProducts.slice(0, 4)} />
        </section>

        <section className="promo-panel" id="offers">
          <div>
            <span className="eyebrow">Small upgrades, big smiles</span>
            <h2>Make room for the things you love.</h2>
            <p>Browse thoughtful picks for your home, work, and weekend.</p>
          </div>
          <Link className="primary-link" to="/products">
            Explore departments <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  )
}

export default Home