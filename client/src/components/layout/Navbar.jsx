import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  UserCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { computerDepartments } from "../../data/computerDepartments.js";
import { artsCraftDepartments } from "../../data/artsCraftDepartments.js";
import { homeKitchenDepartments } from "../../data/homeKitchenDepartments.js";
import { fashionDepartments } from "../../data/fashionDepartments.js";
import {
  electronicsDepartments,
  smartHomeDepartments,
} from "../../data/electronicsDepartments.js";
import { categories } from "../../data/sampleProducts.js";

const digitalServices = [
  {
    name: "Prime Video",
    description: "Watch films and shows in this store",
    to: "/digital/video",
  },
  {
    name: "Amazon Music",
    description: "Listen to music in this store",
    to: "/digital/music",
  },
  {
    name: "Kindle",
    description: "Explore books and reading",
    to: "/digital/kindle",
  },
  {
    name: "Amazon Appstore",
    description: "Browse apps in this store",
    to: "/digital/appstore",
  },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [submenuCategory, setSubmenuCategory] = useState(null);
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const [showSecondChanceVideo, setShowSecondChanceVideo] = useState(false);
  const closeMenu = () => {
    setOpen(false);
    setSubmenuCategory(null);
  };
  const departments = [
    {
      name: "Electronics",
      to: "/categories/Electronics",
      submenu: electronicsDepartments.filter(
        (department) => department.group !== "Smart Home",
      ),
    },
    {
      name: "Computers",
      to: "/categories/Computers",
      submenu: computerDepartments,
    },
    {
      name: "Smart Home",
      to: "/categories/Electronics",
      submenu: smartHomeDepartments,
    },
    {
      name: "Arts & Crafts",
      to: "/categories/Arts%20%26%20Crafts",
      submenu: artsCraftDepartments,
    },
    {
      name: "Home & Kitchen",
      to: "/categories/Home%20%26%20Kitchen",
      submenu: homeKitchenDepartments,
    },
    {
      name: "Fashion",
      to: "/categories/Fashion",
      submenu: fashionDepartments,
      submenuTitle: "Men's Fashion",
    },
  ];
  const moreDepartments = categories.filter(
    ({ name }) => !departments.some((department) => department.name === name),
  );
  const programs = [
    {
      name: "Gift Cards",
      description: "Browse the project store",
      to: "/products",
    },
    {
      name: "Amazon Live",
      description: "Watch videos in this project",
      to: "/digital/video",
    },
    {
      name: "International Shopping",
      description: "Browse products available in this project",
      to: "/products",
    },
    {
      name: "Amazon Second Chance",
      description: "Explore more project products",
      to: "/products",
      image:
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=480&q=85",
      videoId: "R6MlUcmOul8",
    },
  ];

  return (
    <>
      <nav className="desktop-nav" aria-label="Product categories">
        <div className="nav-inner">
          <button
            className="nav-link nav-all-link"
            type="button"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={18} strokeWidth={2.5} aria-hidden="true" />
            <span>All</span>
          </button>
          {categories.map((category) => (
            <NavLink
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              key={category.name}
              to={`/categories/${encodeURIComponent(category.name)}`}
            >
              {category.name}
            </NavLink>
          ))}
          <Link className="nav-link" to="/products?sort=popular">
            Today&apos;s finds
          </Link>
        </div>
      </nav>
      {open && (
        <div className="menu-backdrop" onClick={closeMenu}>
          <aside
            className="menu-drawer"
            aria-label="Main menu"
            onClick={(event) => event.stopPropagation()}
          >
            {submenuCategory ? (
              <div className="menu-drawer-header menu-drawer-submenu-header">
                <button
                  className="menu-submenu-back"
                  type="button"
                  onClick={() => setSubmenuCategory(null)}
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                  <span>MAIN MENU</span>
                </button>
                <button
                  className="menu-close"
                  type="button"
                  aria-label="Close menu"
                  onClick={closeMenu}
                >
                  <X />
                </button>
              </div>
            ) : (
              <div className="menu-drawer-header">
                <Link to="/login" className="menu-greeting" onClick={closeMenu}>
                  <UserCircle size={25} aria-hidden="true" />
                  <span>Hello, sign in</span>
                </Link>
                <button
                  className="menu-close"
                  type="button"
                  aria-label="Close menu"
                  onClick={closeMenu}
                >
                  <X />
                </button>
              </div>
            )}

            {submenuCategory ? (
              <section className="menu-section menu-department-submenu">
                <h2>{submenuCategory.submenuTitle ?? submenuCategory.name}</h2>
                {submenuCategory.departments.map(({ name }) => (
                  <Link
                    key={name}
                    to={`${submenuCategory.to}?department=${encodeURIComponent(name)}`}
                    onClick={closeMenu}
                  >
                    {name}
                  </Link>
                ))}
              </section>
            ) : (
              <>
                <section className="menu-section menu-digital">
                  <h2>Digital Content &amp; Devices</h2>
                  {digitalServices.map(({ name, description, to }) => (
                    <Link
                      className="menu-service"
                      key={name}
                      to={to}
                      onClick={closeMenu}
                    >
                      <span>
                        {name}
                        <small>{description}</small>
                      </span>
                      <ChevronDown
                        className="menu-service-arrow"
                        size={16}
                        aria-hidden="true"
                      />
                    </Link>
                  ))}
                </section>

                <section className="menu-section">
                  <h2>Shop by Department</h2>
                  {departments.map(({ name, to, submenu }) =>
                    submenu ? (
                      <button
                        className="menu-department-link"
                        key={name}
                        type="button"
                        onClick={() =>
                          setSubmenuCategory({
                            name,
                            to,
                            departments: submenu,
                            submenuTitle: departments.find(
                              (department) => department.name === name,
                            )?.submenuTitle,
                          })
                        }
                      >
                        {name}
                        <ChevronRight size={17} aria-hidden="true" />
                      </button>
                    ) : (
                      <Link key={name} to={to} onClick={closeMenu}>
                        {name}
                      </Link>
                    ),
                  )}
                  {showAllDepartments &&
                    moreDepartments.map(({ name }) => (
                      <Link
                        key={name}
                        to={`/categories/${encodeURIComponent(name)}`}
                        onClick={closeMenu}
                      >
                        {name}
                      </Link>
                    ))}
                  <button
                    className="menu-see-all"
                    type="button"
                    aria-expanded={showAllDepartments}
                    onClick={() =>
                      setShowAllDepartments((expanded) => !expanded)
                    }
                  >
                    {showAllDepartments ? "See less" : "See all"}{" "}
                    <ChevronDown
                      className={showAllDepartments ? "is-expanded" : ""}
                      size={16}
                      aria-hidden="true"
                    />
                  </button>
                </section>

                <section className="menu-section">
                  <h2>Programs &amp; Features</h2>
                  <div className="menu-program-list">
                    {programs.map(({ name, description, to, image, videoId }) =>
                      name === "Amazon Second Chance" ? (
                        <div className="menu-program menu-program-second-chance" key={name}>
                          <Link
                            className="menu-program-copy"
                            to={to}
                            onClick={closeMenu}
                          >
                            <span>
                              <strong>{name}</strong>
                              <small>{description}</small>
                            </span>
                            <span aria-hidden="true">›</span>
                          </Link>
                          <div className="menu-second-chance-media">
                            <img
                              src={image}
                              alt="Recycling and giving products another life"
                              loading="lazy"
                            />
                            {showSecondChanceVideo ? (
                              <div className="menu-second-chance-player">
                                <iframe
                                  src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1`}
                                  title="Second Chance sample video"
                                  loading="lazy"
                                  referrerPolicy="strict-origin-when-cross-origin"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                />
                                <button
                                  type="button"
                                  aria-label="Close Second Chance video"
                                  onClick={() => setShowSecondChanceVideo(false)}
                                >
                                  <X size={13} aria-hidden="true" />
                                </button>
                              </div>
                            ) : (
                              <button
                                className="menu-second-chance-play"
                                type="button"
                                aria-label="Play Second Chance sample video"
                                onClick={() => setShowSecondChanceVideo(true)}
                              />
                            )}
                          </div>
                        </div>
                      ) : (
                        <Link
                          className="menu-program"
                          key={name}
                          to={to}
                          onClick={closeMenu}
                        >
                          <span>
                            <strong>{name}</strong>
                            <small>{description}</small>
                          </span>
                          <span aria-hidden="true">›</span>
                        </Link>
                      ),
                    )}
                  </div>
                </section>

                <section className="menu-section">
                  <h2>Help &amp; Settings</h2>
                  <Link to="/profile" onClick={closeMenu}>
                    Your Account
                  </Link>
                  <Link to="/profile" onClick={closeMenu}>
                    ◎ &nbsp; English
                  </Link>
                  <Link to="/profile" onClick={closeMenu}>
                    🇪🇹 &nbsp; Ethiopia
                  </Link>
                  <Link to="/profile" onClick={closeMenu}>
                    Customer Service
                  </Link>
                  <Link to="/login" onClick={closeMenu}>
                    Sign in
                  </Link>
                </section>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}

export default Navbar;
