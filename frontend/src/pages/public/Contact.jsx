import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, MapPin, Phone, Mail } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');
  const [content, setContent] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get('/api/content');
        const loaded = {};
        Object.keys(res.data).forEach(k => { loaded[k] = res.data[k].content; });
        setContent(loaded);
      } catch (err) {
        console.error('Failed to load contact page data', err);
      }
    };
    fetchContent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await axios.post('/api/inquiries', formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
    setTimeout(() => setStatus(''), 5000);
  };

  return (
    <div className="contact-page animate-fade-in">
      <div className="contact-header">
         <h1 className="page-title">Get In Touch</h1>
         <p className="page-subtitle">Have questions about our products or services? We are here to help.</p>
      </div>

      <div className="contact-content">
        <div className="contact-info-cards">
            <div className="info-card">
              <div className="info-icon"><MapPin size={28}/></div>
              <h3>Head Office</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{content.contact_address || '123 Global Trade Hub\nBusiness District, NY 10001\nUnited States'}</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon"><Phone size={28}/></div>
              <h3>Phone</h3>
              <p>{content.contact_phone || '+1 234 567 890'}<br/>Mon-Fri, 9am-6pm</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon"><Mail size={28}/></div>
              <h3>Email</h3>
              <p>{content.contact_email || 'info@swamisamarth.com'}<br/>{content.contact_support_email || 'support@swamisamarth.com'}</p>
            </div>
        </div>

        <div className="contact-form-section">
          <div className="form-container">
            <h2>Send us a message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea rows="6" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
              </div>
              
              <button type="submit" className="btn-primary submit-btn" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending...' : <span style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>Send Message <Send size={18}/></span>}
              </button>
              
              {status === 'success' && <div className="status-message success">Thank you! Your inquiry has been sent.</div>}
              {status === 'error' && <div className="status-message error">Something went wrong. Please try again.</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
