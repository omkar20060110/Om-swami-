import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Mail, Eye, X, User, Package, MessageSquare, Trash2, Calendar, MapPin, Globe, AlertCircle } from 'lucide-react';
import * as xlsx from 'xlsx';
import './AdminInquiries.css';

const AdminInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
  
    const fetchData = async () => {
      setLoading(true);
      try {
        const [inqRes, prodRes] = await Promise.all([
          axios.get('/api/inquiries'),
          axios.get('/api/products')
        ]);
        setInquiries(inqRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.error('Failed to fetch inquiries', err);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => { fetchData(); }, []);
  
    const exportToExcel = () => {
        const ws = xlsx.utils.json_to_sheet(inquiries);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "Inquiries");
        xlsx.writeFile(wb, "Global_Exports_Inquiries.xlsx");
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await axios.delete(`/api/inquiries/${deleteId}`);
            setDeleteId(null);
            fetchData();
        } catch (err) {
            alert('Failed to delete inquiry');
        }
    };

    return (
      <div className="admin-inquiries-container animate-fade-in">
        <div className="admin-header-card">
          <div className="header-info">
            <h2>Business Inquiries</h2>
            <p>Track and manage product interests from global buyers.</p>
          </div>
          <button className="export-btn" onClick={exportToExcel}>
            <Download size={18} /> Export CSV
          </button>
        </div>
  
        <div className="inquiries-grid">
          {inquiries.map(i => (
            <div key={i.id} className="inquiry-card">
              <div className="card-header">
                <div className="buyer-meta">
                  <div className="buyer-avatar">
                    <User size={20}/>
                  </div>
                  <div className="buyer-name-box">
                    <span className="buyer-name">{i.name}</span>
                    <span className="buyer-company">{i.company_name}</span>
                  </div>
                </div>
                <span className="date-tag">{i.date}</span>
              </div>

              <div className="card-body">
                <div className="interest-box">
                  <Package size={16} />
                  <span className="interest-product">{i.product_name}</span>
                  <span className="interest-cat">({i.product_category})</span>
                </div>
                
                <div className="contact-details">
                  <div className="detail-item"><Mail size={14}/> {i.email}</div>
                  <div className="detail-item"><Globe size={14}/> {i.country}</div>
                </div>

                <p className="message-preview">
                  {i.message || "No specific requirements provided."}
                </p>
              </div>

              <div className="card-footer">
                <button className="btn-view" onClick={() => setSelectedInquiry(i)}>
                  <Eye size={16}/> View Details
                </button>
                <button className="btn-delete-icon" onClick={() => setDeleteId(i.id)}>
                  <Trash2 size={16}/>
                </button>
              </div>
            </div>
          ))}

          {inquiries.length === 0 && !loading && (
            <div className="empty-state-full">
               <MessageSquare size={64} />
               <h3>No Inquiries Yet</h3>
               <p>When customers ask about your products, they will appear here.</p>
            </div>
          )}
        </div>

        {/* Inquiry Detail Modal */}
        {selectedInquiry && (
          <div className="premium-modal-overlay" onClick={() => setSelectedInquiry(null)}>
            <div className="inquiry-modal-content" onClick={e => e.stopPropagation()}>
               <div className="inquiry-modal-header">
                  <div className="title-area">
                    <div className="modal-icon"><Mail size={24}/></div>
                    <div>
                      <h3>Inquiry Details</h3>
                      <p>Received on {selectedInquiry.date}</p>
                    </div>
                  </div>
                  <button className="close-btn" onClick={() => setSelectedInquiry(null)}><X size={20}/></button>
               </div>

               <div className="inquiry-modal-body">
                 <div className="modal-section">
                    <label>Customer Identity</label>
                    <div className="detail-grid">
                      <div className="grid-item"><strong>Full Name:</strong> {selectedInquiry.name}</div>
                      <div className="grid-item"><strong>Company:</strong> {selectedInquiry.company_name}</div>
                      <div className="grid-item"><strong>Email:</strong> {selectedInquiry.email}</div>
                      <div className="grid-item"><strong>Phone:</strong> {selectedInquiry.phone}</div>
                      <div className="grid-item"><strong>Location:</strong> {selectedInquiry.country}</div>
                    </div>
                 </div>

                 <div className="modal-section product-interest-section">
                    <label>Products Requested</label>
                    <div className="product-info-card">
                       {products.find(p => p.name === selectedInquiry.product_name)?.image_url ? (
                         <img src={`/api${products.find(p => p.name === selectedInquiry.product_name).image_url}`} alt="prod" />
                       ) : (
                         <div className="placeholder-img"><Package size={32}/></div>
                       )}
                       <div className="product-meta">
                         <h4>{selectedInquiry.product_name}</h4>
                         <span className="p-cat">{selectedInquiry.product_category}</span>
                       </div>
                    </div>
                 </div>

                 <div className="modal-section">
                    <label>Message / Requirements</label>
                    <div className="message-box">
                      {selectedInquiry.message || "The customer did not include a specific message."}
                    </div>
                 </div>
               </div>

               <div className="inquiry-modal-footer">
                 <a href={`mailto:${selectedInquiry.email}`} className="reply-btn">Reply via Email</a>
                 <button className="close-secondary" onClick={() => setSelectedInquiry(null)}>Done</button>
               </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteId && (
          <div className="premium-modal-overlay center" onClick={() => setDeleteId(null)}>
            <div className="confirm-delete-modal" onClick={e => e.stopPropagation()}>
              <div className="warn-icon"><AlertCircle size={32}/></div>
              <h3>Remove Inquiry?</h3>
              <p>Are you sure you want to delete this record? This cannot be undone.</p>
              <div className="confirm-btns">
                <button className="btn-cancel-modal" onClick={() => setDeleteId(null)}>Keep Record</button>
                <button className="btn-confirm-delete" onClick={handleDelete}>Delete Permanently</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default AdminInquiries;
