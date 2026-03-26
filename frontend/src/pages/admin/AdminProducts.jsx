import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { Plus, Edit, Trash2, Image as ImageIcon, X, AlertTriangle, CheckCircle, Package, Search, UploadCloud } from 'lucide-react';
import { getResourceUrl } from '../../utils/urlHelper';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null); // Custom delete confirmation modal state
  
  const [formData, setFormData] = useState({
    name: '', hs_code: '', description: '', export_country: '',
    price: '', currency: 'INR', category_id: '', image_url: '', additional_images: []
  });

  const CURRENCY_SYMBOLS = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'AUD': 'A$',
    'CAD': 'C$',
    'JPY': '¥'
  };


  // Lock body scroll when full-page modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/categories')
      ]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (prod = null) => {
    if (prod) {
      setFormData({
        ...prod,
        additional_images: prod.additional_images || []
      });
      setEditingId(prod.id);
    } else {
      setFormData({ name: '', hs_code: '', description: '', export_country: '', price: '', currency: 'INR', category_id: '', image_url: '', additional_images: [] });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', hs_code: '', description: '', export_country: '', price: '', currency: 'INR', category_id: '', image_url: '', additional_images: [] });
    setEditingId(null);
  };

  const handleImageUpload = async (e, isPrimary = true) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const uploadSingle = async (file) => {
      const fd = new FormData();
      fd.append('file', file);
      const res = await axios.post('/api/upload', fd);
      return res.data.url;
    };

    try {
      if (isPrimary) {
        const url = await uploadSingle(files[0]);
        setFormData({...formData, image_url: url});
      } else {
        const newUrls = await Promise.all(Array.from(files).map(file => uploadSingle(file)));
        setFormData({
          ...formData, 
          additional_images: [...formData.additional_images, ...newUrls]
        });
      }
    } catch (err) {
      alert('Upload failed');
    }
  };

  const removeAdditionalImage = (index) => {
    const newImages = [...formData.additional_images];
    newImages.splice(index, 1);
    setFormData({...formData, additional_images: newImages});
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`/api/products/${deleteId}`);
      setDeleteId(null);
      fetchData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/products/${editingId}`, formData);
      } else {
        await axios.post('/api/products', formData);
      }
      closeModal();
      fetchData();
    } catch (err) {
      alert('Save failed');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.hs_code && p.hs_code.includes(searchTerm))
  );

  return (
    <div className="admin-products-container animate-fade-in">
      <div className="admin-header-card">
        <div className="header-info">
          <h2>Product Inventory</h2>
          <p>Manage your export items, HS codes, and product categories.</p>
        </div>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-btn" onClick={() => openModal()}>
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      <div className="products-card">
        <div className="table-responsive">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>HS Code</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="product-cell">
                      {p.image_url ? (
                        <img src={getResourceUrl(p.image_url)} alt={p.name} className="p-thumb"/>
                      ) : (
                        <div className="p-thumb-empty"><Package size={20}/></div>
                      )}
                      <div className="p-details">
                        <span className="p-name">{p.name}</span>
                        <span className="p-location">{p.export_country || 'Worldwide'}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="tag-category">
                      {categories.find(c => c.id === p.category_id)?.name || 'General'}
                    </span>
                  </td>
                  <td><code>{p.hs_code || 'N/A'}</code></td>
                  <td>{CURRENCY_SYMBOLS[p.currency || 'INR'] || ''}{p.price || '--'}</td>
                  <td>
                    <div className="row-actions">
                      <button className="action-button edit" onClick={() => openModal(p)} title="Edit"><Edit size={16}/></button>
                      <button className="action-button delete" onClick={() => setDeleteId(p.id)} title="Delete"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="empty-state">
                    <Package size={48} />
                    <p>No products found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Form Modal - Rendered via Portal to ensure full coverage */}
      {isModalOpen && createPortal(
        <div className="premium-modal-overlay full-page-modal" onClick={closeModal}>
          <div className="premium-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="header-text">
                <h3>{editingId ? 'Update Product Details' : 'Add New Export Product'}</h3>
                <p>Fill in the specifications and upload high-quality media for your product.</p>
              </div>
              <button className="close-x" onClick={closeModal}><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="premium-form">
              <div className="form-scroll-area">
                <div className="form-columns">
                  {/* Left Column: Details */}
                  <div className="form-column">
                    <div className="form-section">
                      <label className="section-title">Common Information</label>
                      <div className="input-field">
                        <label>Product Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Premium Basmati Rice" 
                          value={formData.name} 
                          onChange={e => setFormData({...formData, name: e.target.value})} 
                          required 
                        />
                      </div>
                      
                      <div className="form-grid">
                        <div className="input-field">
                          <label>HS Code</label>
                          <input type="text" placeholder="e.g. 1006.30" value={formData.hs_code} onChange={e => setFormData({...formData, hs_code: e.target.value})} />
                        </div>
                        <div className="input-field" style={{ flex: 1 }}>
                          <label>Currency</label>
                          <select value={formData.currency || 'INR'} onChange={e => setFormData({...formData, currency: e.target.value})} required>
                            {Object.keys(CURRENCY_SYMBOLS).map(code => (
                              <option key={code} value={code}>{code} ({CURRENCY_SYMBOLS[code]})</option>
                            ))}
                          </select>
                        </div>
                        <div className="input-field" style={{ flex: 2 }}>
                          <label>Base Price</label>
                          <input type="number" step="0.01" placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                        </div>
                      </div>

                      <div className="input-field">
                        <label>Category</label>
                        <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} required>
                          <option value="">Select a Category</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="form-section">
                      <label className="section-title">Export Specifications</label>
                      <div className="input-field">
                        <label>Primary Export Regions</label>
                        <input type="text" placeholder="e.g. Middle East, USA, Europe" value={formData.export_country} onChange={e => setFormData({...formData, export_country: e.target.value})} />
                      </div>
                      <div className="input-field">
                        <label>Product Description</label>
                        <textarea placeholder="Write a detailed description of the product quality, packaging, and origins..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="6" required />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Media */}
                  <div className="form-column">
                    <div className="form-section">
                      <label className="section-title">Media & Gallery</label>
                      <p className="field-desc">The first image will be the primary photo shown in the catalog.</p>
                      
                      <div className="media-management">
                        <div className="main-image-upload">
                          <label>Primary Photo</label>
                          <div className="uploader-box large">
                            <input type="file" id="prod-img" onChange={(e) => handleImageUpload(e, true)} accept="image/*" hidden />
                            <label htmlFor="prod-img" className="uploader-label">
                              {formData.image_url ? (
                                <div className="preview-container">
                                  <img src={getResourceUrl(formData.image_url)} alt="preview" />
                                  <div className="change-overlay">
                                    <UploadCloud size={24} />
                                    <span>Update Image</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="upload-placeholder">
                                  <div className="p-icon-circle"><ImageIcon size={40} /></div>
                                  <span>Drop primary photo here</span>
                                  <p>PNG, JPG up to 10MB • 1200x800px recommended</p>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>

                        <div className="additional-photos">
                          <label>Additional Gallery Photos</label>
                          <div className="uploader-grid">
                            {formData.additional_images.map((img, idx) => (
                              <div key={idx} className="uploader-box gallery-item">
                                 <img src={getResourceUrl(img)} alt="gallery" />
                                 <button type="button" className="remove-img" onClick={() => removeAdditionalImage(idx)}><X size={14}/></button>
                              </div>
                            ))}

                            <div className="uploader-box add-more">
                              <input type="file" id="prod-additional" onChange={(e) => handleImageUpload(e, false)} accept="image/*" multiple hidden />
                              <label htmlFor="prod-additional" className="uploader-label add-label">
                                 <div className="add-icon-btn"><Plus size={20} /></div>
                                 <span>Add Gallery</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="secondary-btn" onClick={closeModal}>Discard Changes</button>
                <button type="submit" className="primary-btn submit-large">
                  <CheckCircle size={18} /> {editingId ? 'Update Product' : 'Publish Product'}
                </button>
              </div>
            </form>

          </div>
        </div>,
        document.body
      )}




      {/* Custom Delete Confirmation Modal */}
      {deleteId && (
        <div className="premium-modal-overlay small" onClick={() => setDeleteId(null)}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon"><AlertTriangle size={32}/></div>
            <h3>Permanently Delete?</h3>
            <p>This action cannot be undone. All data associated with this product will be removed from the inventory.</p>
            <div className="confirm-actions">
              <button className="secondary-btn" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="danger-btn" onClick={handleDelete}>Yes, Delete It</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
