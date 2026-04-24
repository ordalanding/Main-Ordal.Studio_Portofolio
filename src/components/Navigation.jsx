import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import './Navigation.css';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="nav">
      <div className="nav-container">
        {/* LOGO */}
        <Link to="/" className="brand">
          ORDAL.STUDIO
        </Link>
        
        {/* CENTER LINKS */}
        <div className="desktop-nav">
          {links.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={clsx('nav-link', location.pathname === link.path && 'active')}
            >
              {/* Optional: Add small tiny square or indicator if active based on design */}
              {link.name}
            </Link>
          ))}
        </div>

        {/* RIGHT ACTION */}
        <div className="desktop-action">
          <Link to="/contact">
            <button className="btn-nav-primary">GET STARTED</button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="mobile-nav glass">
          {links.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={clsx('mobile-link', location.pathname === link.path && 'active')}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/contact" onClick={() => setIsOpen(false)}>
            <button className="btn-primary w-full mt-4">GET STARTED</button>
          </Link>
        </div>
      )}
    </nav>
  );
}
