import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { ArrowRight, PlaneTakeoff, ShieldCheck, Award, Users } from 'lucide-react';
import { getResourceUrl } from '../../utils/urlHelper';
import './Home.css';

const Home = () => {
  const [content, setContent] = useState({});
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [heroSlides, setHeroSlides] = useState([]);

  // Swipe Handlers for Hero
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % Math.max(heroSlides.length, 1));
    }, 7000); 
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const cRes = await axios.get('/api/content');
        const loaded = {};
        Object.keys(cRes.data).forEach(k => { loaded[k] = cRes.data[k].content; });
        setContent(loaded);

        // Build slides from dynamic admin content
        const slides = [1, 2, 3]
          .map(n => loaded[`hero_slide_${n}`])
          .filter(Boolean)
          .map(url => ({ type: 'image', url: `/api${url}` }));
        setHeroSlides(slides.length > 0 ? slides : [
          { type: 'fallback', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }
        ]);
        
        const pRes = await axios.get('/api/products');
        setProducts(pRes.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load home data', err);
      }
    };
    fetchHomeData();
  }, []);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    if (touchStart - touchEnd > 70) {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    } else if (touchStart - touchEnd < -70) {
      setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section 
        className="hero-section" 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="hero-content animate-slide-up">
          <span className="hero-badge">Global Trade Excellence</span>
          <h1>{content.home_hero_title || 'Leading Export Solutions Worldwide'}</h1>
          <p>{content.home_hero_subtitle || 'Connecting global markets with premium quality products and professional export solutions.'}</p>
          <div className="hero-actions">
            <NavLink to="/products" className="btn-primary" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem'}}>
              Explore Products <ArrowRight size={18}/>
            </NavLink>
            <NavLink to="/contact" className="btn-secondary">Contact Us</NavLink>
          </div>
        </div>
        <div className="hero-overlay"></div>
        
        <div className="hero-slider">
          {heroSlides.map((slide, index) => (
            <div key={index} className={`slide ${index === currentSlide ? 'active' : ''}`}>
              {slide.type === 'fallback' ? (
                <div className="hero-bg" style={{ background: slide.gradient }} />
              ) : slide.type === 'video' ? (
                <video src={slide.url} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <img src={slide.url} alt={`Slide ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
          ))}
        </div>

        <div className="hero-nav-dots">
          {heroSlides.map((_, i) => (
            <button key={i} className={`dot ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)}></button>
          ))}
        </div>
      </section>

      {/* Stats / Track Record */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-box">
            <PlaneTakeoff className="stat-icon"/>
            <h3>{content.stat_countries || '50+'}</h3>
            <p>Countries Exported</p>
          </div>
          <div className="stat-box">
            <ShieldCheck className="stat-icon"/>
            <h3>{content.stat_quality || '100%'}</h3>
            <p>Quality Assured</p>
          </div>
          <div className="stat-box">
            <Users className="stat-icon"/>
            <h3>{content.stat_clients || '1000+'}</h3>
            <p>Happy Clients</p>
          </div>
          <div className="stat-box">
            <Award className="stat-icon"/>
            <h3>{content.stat_years || '15+'}</h3>
            <p>Years Experience</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="section-header text-center">
          <h2 className="section-title">Premium Export Products</h2>
          <p className="section-subtitle">Discover our top-tier agricultural and industrial goods ready for global shipping.</p>
        </div>
        
        <div className="product-grid">
          {products.length > 0 ? products.map(p => (
            <div key={p.id} className="product-card">
              <div className="product-img-wrapper">
                {p.image_url ? (
                  <img src={getResourceUrl(p.image_url)} alt={p.name} className="product-img" />
                ) : (
                  <div className="product-img-placeholder">No Image</div>
                )}
                <span className="export-badge">Export Ready</span>
              </div>
              <div className="product-info">
                <h3>{p.name}</h3>
                <p className="product-desc">{p.description.substring(0, 80)}...</p>
                <NavLink to="/products" className="view-more">View Details &rarr;</NavLink>
              </div>
            </div>
          )) : (
            <p style={{textAlign: 'center', width: '100%', color: 'var(--text-muted)'}}>No featured products available.</p>
          )}
        </div>
        
        <div className="text-center" style={{marginTop: '3rem'}}>
           <NavLink to="/products" className="btn-secondary">View All Products</NavLink>
        </div>
      </section>

      {/* About Section Snippet */}
      <section className="about-snippet">
        <div className="about-text">
          <h2 className="section-title">Why Choose Swami Samarth Exports?</h2>
          <p>{content.about_us_text || 'We are dedicated to bridging the gap between quality manufacturers and global buyers. With years of experience and a track record of excellence, we ensure seamless trade operations.'}</p>
          <NavLink to="/about" className="learn-more-link">Learn More About Us &rarr;</NavLink>
        </div>
        <div className="about-grid">
           <div className="about-feature">
              <h4>Global Network</h4>
              <p>Strong connections across continents.</p>
           </div>
           <div className="about-feature">
              <h4>Verified Quality</h4>
              <p>Strict QA processes for all goods.</p>
           </div>
           <div className="about-feature">
              <h4>End-to-End Logistics</h4>
              <p>Reliable shipping and handling.</p>
           </div>
           <div className="about-feature">
              <h4>Expert Support</h4>
              <p>24/7 assistance for our partners.</p>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
