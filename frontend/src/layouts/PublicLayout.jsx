import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, Outlet } from 'react-router-dom';
import { Menu, X, Globe, Mail, Phone, MapPin, UserCheck } from 'lucide-react';
import { getResourceUrl } from '../utils/urlHelper';
import './PublicLayout.css';

const PublicLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [content, setContent] = useState({});
  const [logoUrl, setLogoUrl] = useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/content');
        const loaded = {};
        Object.keys(res.data).forEach(k => { loaded[k] = res.data[k].content; });
        setContent(loaded);
        if (loaded.site_logo) {
          setLogoUrl(getResourceUrl(loaded.site_logo));
        }
      } catch (err) {
        console.error('Failed to load layout data', err);
      }
    };
    fetchData();
  }, []);

  const Logo = ({ className }) => {
    return (
      <NavLink to="/" className={`brand-logo-container ${className || ''}`}>
        <div className="logo-box">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="site-logo-img" />
          ) : (
            <Globe className="logo-placeholder-icon" size={32} />
          )}
        </div>
        <div className="brand-name-wrapper">
          <h1 className="main-brand-name">{content.site_name || 'OM SWAMI'}</h1>
          <p className="sub-brand-name">{content.site_tagline || 'GLOBAL EXPORTS'}</p>
        </div>
      </NavLink>
    );
  };


  return (
    <div className="public-container">
      {/* Top Banner */}
      <div className="top-banner">
        <div className="banner-content">
          <span className="banner-item"><Phone size={14} /> {content.contact_phone || '+1 234 567 890'}</span>
          <span className="banner-item"><Mail size={14} /> {content.contact_email || 'info@swamisamarth.com'}</span>
        </div>
        <div className="banner-content">
          <span className="banner-item"><MapPin size={14} /> {content.contact_address?.split('\n')[0] || 'Global Exports HQ'}</span>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="public-header sticky">
        <div className="nav-container">
          <Logo />

          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
            <NavLink to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
            <NavLink to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>Products</NavLink>
            <NavLink to="/blog" className="nav-link" onClick={() => setIsMenuOpen(false)}>Resources</NavLink>
            <NavLink to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About Us</NavLink>
            <NavLink to="/contact" className="nav-btn-link" onClick={() => setIsMenuOpen(false)}>Contact Us</NavLink>
          </nav>
        </div>
      </header>

      {/* Dynamic Page Content */}
      <main className="public-main">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="public-footer">
        <div className="footer-container">
          <div className="footer-col">
            <Logo className="footer-logo" />

          </div>

          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><NavLink to="/about">About Company</NavLink></li>
              <li><NavLink to="/products">Our Products</NavLink></li>
              <li><NavLink to="/blog">Blog & Resources</NavLink></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Contact Info</h3>
            <ul className="footer-contact">
              <li><MapPin size={18} /> <span>{content.contact_address || '123 Global Trade Hub, NY 10001'}</span></li>
              <li><Phone size={18} /> <span>{content.contact_phone || '+1 234 567 890'}</span></li>
              <li><Mail size={18} /> <span>{content.contact_email || 'info@swamisamarth.com'}</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <p>&copy; {new Date().getFullYear()} Swami Samarth Global Exports. All rights reserved.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <NavLink to="/admin/login" className="admin-access-link">
                <UserCheck size={14} /> Admin Access
              </NavLink>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                Developed by: <a href="https://www.linkedin.com/in/omkar-angadi-003842398?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>Omkar Angadi</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
