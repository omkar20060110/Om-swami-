import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X, CheckCircle, Package, Globe, Tag, Info, ArrowRight } from 'lucide-react';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // UI States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: '', company_name: '', country: '', email: '', phone: '', product_category: '', product_name: '', message: ''
  });
  const [status, setStatus] = useState('');

  // Gallery Context
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [pTouchStart, setPTouchStart] = useState(0);
  const [pTouchEnd, setPTouchEnd] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/categories')
        ]);
        setProducts(pRes.data);
        setCategories(cRes.data);
      } catch (err) {
        console.error('Failed to fetch', err);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? p.category_id === parseInt(selectedCategory) : true;
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentImgIndex(0);
  };

  const openInquiry = (product) => {
    setInquiryData({
      ...inquiryData,
      product_name: product.name,
      product_category: categories.find(c => c.id === product.category_id)?.name || 'General'
    });
    setShowInquiryModal(true);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await axios.post('/api/inquiries', inquiryData);
      setStatus('success');
      setTimeout(() => {
        setStatus('');
        setShowInquiryModal(false);
        setSelectedProduct(null);
        setInquiryData({ name: '', company_name: '', country: '', email: '', phone: '', product_category: '', product_name: '', message: '' });
      }, 3000);
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus(''), 5000);
    }
  };

  const getProductImages = (product) => {
    const images = [];
    if (!product) return images;
    if (product.image_url) images.push(`/api${product.image_url.startsWith('/') ? '' : '/'}${product.image_url}`);
    if (product.additional_images) {
      product.additional_images.forEach(img => {
         images.push(`/api${img.startsWith('/') ? '' : '/'}${img}`);
      });
    }
    return images;
  };

  const productImages = selectedProduct ? getProductImages(selectedProduct) : [];

  const handlePTouchStart = (e) => setPTouchStart(e.targetTouches[0].clientX);
  const handlePTouchMove = (e) => setPTouchEnd(e.targetTouches[0].clientX);
  const handlePTouchEnd = () => {
    if (!pTouchStart || !pTouchEnd) return;
    if (pTouchStart - pTouchEnd > 50) {
      setCurrentImgIndex(prev => (prev + 1) % productImages.length);
    } else if (pTouchStart - pTouchEnd < -50) {
      setCurrentImgIndex(prev => (prev - 1 + productImages.length) % productImages.length);
    }
    setPTouchStart(0);
    setPTouchEnd(0);
  };

  return (
    <div className="public-page animate-fade-in" style={{padding: '4rem 5%', backgroundColor: '#fdfdfd', minHeight: '100vh'}}>
      <div className="page-header text-center" style={{marginBottom: '4rem'}}>
        <h1 style={{color: '#1a365d', fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em'}}>Our Export Catalog</h1>
        <div style={{width: '80px', height: '4px', background: 'linear-gradient(90deg, #3182ce, #a0aec0)', margin: '0 auto 2rem', borderRadius: '2px'}}></div>
        <p style={{color: '#4a5568', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6}}>
          Premium high-quality goods curated for global markets. Discover excellence in every product we export.
        </p>
      </div>

      <div className="filters-bar" style={{display: 'flex', gap: '1.5rem', marginBottom: '4rem', justifyContent: 'center', flexWrap: 'wrap'}}>
        <div style={{position: 'relative', width: '100%', maxWidth: '450px'}}>
          <Search size={20} style={{position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0'}}/>
          <input 
            type="text" 
            placeholder="Search our collection..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{padding: '1rem 1rem 1rem 3.5rem', width: '100%', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', fontSize: '1rem', outline: 'none'}}
          />
        </div>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{padding: '1rem 2.5rem 1rem 1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', fontSize: '1rem', cursor: 'pointer', outline: 'none'}}
        >
          <option value="">All Disciplines</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="product-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem'}}>
          {filteredProducts.length > 0 ? filteredProducts.map(p => (
            <div key={p.id} className="product-card" onClick={() => handleProductClick(p)} style={{
              cursor: 'pointer',
              background: 'white',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              border: '1px solid #f1f5f9'
            }}>
              <div className="product-img-wrapper" style={{height: '280px', position: 'relative', overflow: 'hidden'}}>
                {p.image_url ? (
                  <img src={p.image_url.startsWith('http') ? p.image_url : `/api${p.image_url.startsWith('/') ? '' : '/'}${p.image_url}`} alt={p.name} className="product-img" style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease'}}/>
                ) : (
                  <div className="product-img-placeholder" style={{width: '100%', height: '100%', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8'}}><Package size={48}/></div>
                )}
                <div style={{position:'absolute', top: '1.25rem', right: '1.25rem', backgroundColor: 'rgba(255,255,255,0.95)', color: '#2d3748', padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, backdropFilter: 'blur(4px)', border: '1px solid rgba(0,0,0,0.05)'}}>
                  {p.hs_code ? `HS: ${p.hs_code}` : 'Verified Export'}
                </div>
              </div>
              <div className="product-info" style={{padding: '1.75rem'}}>
                <span style={{color: '#3182ce', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em'}}>{categories.find(c => c.id === p.category_id)?.name || 'Export Quality'}</span>
                <h3 style={{margin: '0.75rem 0', color: '#1a365d', fontSize: '1.5rem', fontWeight: 700}}>{p.name}</h3>
                <p style={{color: '#718096', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{p.description}</p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontSize: '0.9rem', color: '#4a5568', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem'}}><Globe size={16}/> Global Delivery</span>
                  <div style={{color: '#3182ce', transform: 'translateX(0)', transition: 'transform 0.3s ease'}} className="view-more"><ArrowRight size={20}/></div>
                </div>
              </div>
            </div>
          )) : (
            <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 2rem', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0'}}>
              <Info size={48} style={{color: '#a0aec0', marginBottom: '1.5rem'}}/>
              <h3 style={{color: '#4a5568', margin: 0}}>No products found matching your search.</h3>
            </div>
          )}
        </div>

      {/* Product Details Modal */}
      {selectedProduct && !showInquiryModal && (
        <div className="modal-overlay" style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'2rem'}}>
          <div className="modal-content animate-scale-up" style={{background:'white', width:'100%', maxWidth:'1000px', borderRadius:'32px', display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', overflow:'hidden', position:'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'}}>
            <button onClick={() => { setSelectedProduct(null); setCurrentImgIndex(0); }} style={{position:'absolute', top:'1.5rem', right:'1.5rem', background:'white', border:'none', borderRadius:'50%', width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 4px 12px rgba(0,0,0,0.1)', zIndex:10}}><X size={20}/></button>
            
            <div 
                style={{height:'100%', minHeight: '400px', position: 'relative', background: '#000'}}
                onTouchStart={handlePTouchStart}
                onTouchMove={handlePTouchMove}
                onTouchEnd={handlePTouchEnd}
            >
              {productImages.length > 0 ? (
                <>
                  <img src={productImages[currentImgIndex]} alt={selectedProduct.name} style={{width:'100%', height:'100%', objectFit:'contain', transition: 'all 0.3s ease'}}/>
                  
                  {productImages.length > 1 && (
                    <>
                      <div style={{position: 'absolute', bottom: '1.5rem', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '0.5rem'}}>
                        {productImages.map((_, i) => (
                          <div key={i} onClick={() => setCurrentImgIndex(i)} style={{width: '8px', height: '8px', borderRadius: '50%', background: i === currentImgIndex ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s'}}></div>
                        ))}
                      </div>
                      <button onClick={() => setCurrentImgIndex(prev => (prev - 1 + productImages.length) % productImages.length)} style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>&larr;</button>
                      <button onClick={() => setCurrentImgIndex(prev => (prev + 1) % productImages.length)} style={{position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>&rarr;</button>
                    </>
                  )}
                </>
              ) : (
                <div style={{width:'100%', height:'100%', background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8'}}><Package size={64}/></div>
              )}
            </div>
            
            <div style={{padding: '2.5rem 3.5rem', display: 'flex', flexDirection: 'column'}}>
              <div style={{display:'flex', gap:'1rem', marginBottom: '1.5rem', flexWrap: 'wrap'}}>
                <span style={{background: '#ebf8ff', color: '#2b6cb0', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700}}>{categories.find(c => c.id === selectedProduct.category_id)?.name}</span>
                {selectedProduct.hs_code && <span style={{background: '#f7fafc', color: '#4a5568', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700}}>HS Code: {selectedProduct.hs_code}</span>}
                {selectedProduct.price && <span style={{background: '#f0fff4', color: '#2f855a', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700}}>Est. Price: {{'INR':'₹','USD':'$','EUR':'€','GBP':'£','AUD':'A$','CAD':'C$','JPY':'¥'}[selectedProduct.currency || 'INR'] || ''}{selectedProduct.price}</span>}
              </div>
              <h2 style={{fontSize: '2rem', color: '#1a365d', marginBottom: '1rem', fontWeight: 800}}>{selectedProduct.name}</h2>
              <div style={{flex: 1, overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem'}}>
                 <p style={{fontSize: '1rem', color: '#4a5568', lineHeight: 1.7}}>{selectedProduct.description}</p>
              </div>
              
              <div style={{background: '#f8fafc', padding: '1.25rem', borderRadius: '20px', marginBottom: '1.5rem', border: '1px solid #edf2f7'}}>
                <h4 style={{margin: '0 0 0.75rem 0', color: '#2d3748', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Globe size={16} style={{color: '#3182ce'}}/> Export Information</h4>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem'}}>
                  <div>
                    <span style={{fontSize: '0.75rem', color: '#718096', display: 'block', marginBottom: '0.1rem'}}>Primary Export Region</span>
                    <span style={{fontWeight: 700, color: '#1a365d', fontSize: '0.9rem'}}>{selectedProduct.export_country || 'Worldwide'}</span>
                  </div>
                  <div>
                    <span style={{fontSize: '0.75rem', color: '#718096', display: 'block', marginBottom: '0.1rem'}}>Minimum Order</span>
                    <span style={{fontWeight: 700, color: '#1a365d', fontSize: '0.9rem'}}>Bulk Volume ready</span>
                  </div>
                </div>
              </div>

              <div style={{display: 'flex', gap: '1.5rem'}}>
                <button 
                  onClick={() => openInquiry(selectedProduct)}
                  style={{flex: 1, padding: '1rem', borderRadius: '16px', background: '#3182ce', color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(49, 130, 206, 0.4)', transition: 'all 0.3s'}}
                >
                  Request Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="modal-overlay" style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, padding:'1rem'}}>
          <div className="inquiry-form-container animate-scale-up" style={{background:'white', width:'100%', maxWidth:'600px', borderRadius:'24px', padding:'3rem', position:'relative', maxHeight: '95vh', overflowY: 'auto'}}>
            <button onClick={() => setShowInquiryModal(false)} style={{position:'absolute', top:'1.5rem', right:'1.5rem', background:'none', border:'none', cursor:'pointer', color:'#a0aec0'}}><X size={24}/></button>
            <div style={{textAlign: 'center', marginBottom: '2.5rem'}}>
              <h2 style={{fontSize: '2rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.5rem'}}>Contact Us — To Import our Products</h2>
            </div>

            {status === 'success' ? (
              <div style={{textAlign: 'center', padding: '3rem 0'}}>
                <CheckCircle size={80} style={{color: '#48bb78', marginBottom: '1.5rem'}}/>
                <h3 style={{fontSize: '1.5rem', color: '#2d3748'}}>Thank you for your inquiry!</h3>
                <p style={{color: '#718096'}}>Our export team will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                <div className="form-group">
                  <label style={{display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem', color: '#1a202c'}}>Full Name *</label>
                  <input 
                    required type="text" placeholder="Enter your full name" 
                    value={inquiryData.name} onChange={(e) => setInquiryData({...inquiryData, name: e.target.value})}
                    style={{width: '100%', padding: '0.875rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none'}}
                  />
                </div>

                <div className="form-group">
                  <label style={{display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem', color: '#1a202c'}}>Company Name *</label>
                  <input 
                    required type="text" placeholder="Enter your company name" 
                    value={inquiryData.company_name} onChange={(e) => setInquiryData({...inquiryData, company_name: e.target.value})}
                    style={{width: '100%', padding: '0.875rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none'}}
                  />
                </div>

                <div className="form-group">
                  <label style={{display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem', color: '#1a202c'}}>Country *</label>
                  <input 
                    required type="text" placeholder="Enter your country" 
                    value={inquiryData.country} onChange={(e) => setInquiryData({...inquiryData, country: e.target.value})}
                    style={{width: '100%', padding: '0.875rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none'}}
                  />
                </div>

                <div className="form-group">
                  <label style={{display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem', color: '#1a202c'}}>Email Address *</label>
                  <input 
                    required type="email" placeholder="Enter your email address" 
                    value={inquiryData.email} onChange={(e) => setInquiryData({...inquiryData, email: e.target.value})}
                    style={{width: '100%', padding: '0.875rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none'}}
                  />
                </div>

                <div className="form-group">
                  <label style={{display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem', color: '#1a202c'}}>Mobile Number *</label>
                  <input 
                    required type="tel" placeholder="Enter your mobile number" 
                    value={inquiryData.phone} onChange={(e) => setInquiryData({...inquiryData, phone: e.target.value})}
                    style={{width: '100%', padding: '0.875rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none'}}
                  />
                </div>

                <div className="form-group">
                  <label style={{display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem', color: '#1a202c'}}>Product Category *</label>
                  <select 
                    required value={inquiryData.product_category} onChange={(e) => setInquiryData({...inquiryData, product_category: e.target.value})}
                    style={{width: '100%', padding: '0.875rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#fff'}}
                  >
                    <option value="">Select product category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label style={{display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem', color: '#1a202c'}}>Product Name *</label>
                  <input 
                    required type="text" placeholder="Enter the product name" 
                    value={inquiryData.product_name} onChange={(e) => setInquiryData({...inquiryData, product_name: e.target.value})}
                    style={{width: '100%', padding: '0.875rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none'}}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'sending'}
                  style={{marginTop: '1rem', padding: '1.25rem', background: '#21618c', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer'}}
                >
                  {status === 'sending' ? 'Submitting...' : 'Submit Inquiry'}
                </button>
                {status === 'error' && <p style={{color: '#e53e3e', fontSize: '0.8rem', textAlign: 'center'}}>Failed to submit. Please try again.</p>}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
