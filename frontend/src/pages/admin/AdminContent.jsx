import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Save, Upload, Image as ImageIcon, Film, Mail, Phone, MapPin, Facebook, Linkedin, Globe, Award } from 'lucide-react';

const ContentCard = ({ title, sectionKey, type = 'text', icon: Icon, description, content, handleChange, handleSave, saving }) => (
  <div className="content-card animate-fade-in" style={{
    background: 'white',
    padding: '2rem',
    borderRadius: '1.5rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f1f5f9',
    transition: 'all 0.3s ease'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
      <div>
        <h3 style={{ margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
          {Icon && <Icon size={20} style={{ color: '#6366f1' }} />} {title}
        </h3>
        {description && <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>{description}</p>}
      </div>
      <button 
        className="btn-save" 
        onClick={() => handleSave(sectionKey)} 
        disabled={saving[sectionKey]}
        style={{
          background: saving[sectionKey] ? '#94a3b8' : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1.25rem',
          borderRadius: '0.75rem',
          fontWeight: '600',
          fontSize: '0.9rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
        }}
      >
        {saving[sectionKey] ? '...' : <><Save size={16} /> Save</>}
      </button>
    </div>
    {type === 'textarea' ? (
      <textarea 
        rows="4" 
        value={content[sectionKey] || ''} 
        onChange={(e) => handleChange(sectionKey, e.target.value)}
        style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem', outline: 'none' }}
      />
    ) : (
      <input 
        type="text" 
        value={content[sectionKey] || ''} 
        onChange={(e) => handleChange(sectionKey, e.target.value)}
        style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem', outline: 'none' }}
      />
    )}
  </div>
);

const AdminContent = () => {
  const [content, setContent] = useState({
    home_hero_title: '', home_hero_subtitle: '', 
    about_us_text: '', contact_email: '', contact_phone: '',
    contact_address: '', contact_support_email: '',
    social_facebook: '', social_linkedin: '',
    site_logo: '',
    hero_slide_1: '', hero_slide_2: '', hero_slide_3: ''
  });
  
  const [saving, setSaving] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await axios.get('/api/content');
      const loaded = {};
      Object.keys(res.data).forEach(key => {
        loaded[key] = res.data[key].content;
      });
      setContent(prev => ({...prev, ...loaded}));
    } catch (err) {
      console.error('Failed to fetch content', err);
    }
  };

  const handleChange = (key, value) => {
    setContent(prev => ({...prev, [key]: value}));
  };

  const handleSave = async (sectionKey) => {
    setSaving(prev => ({...prev, [sectionKey]: true}));
    try {
      await axios.put(`/api/content/${sectionKey}`, {
        content: content[sectionKey]
      });
    } catch (err) {
      console.error('Failed to save', sectionKey, err);
    }
    setSaving(prev => ({...prev, [sectionKey]: false}));
  };

  const handleFileUpload = async (event, sectionKey) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setSaving(prev => ({...prev, [sectionKey]: true}));
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileUrl = res.data.url;
      handleChange(sectionKey, fileUrl);
      await axios.put(`/api/content/${sectionKey}`, {
        content: fileUrl
      });
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed');
    }
    setSaving(prev => ({...prev, [sectionKey]: false}));
  };

  return (
    <div className="admin-page animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div className="page-header" style={{ marginBottom: '2.5rem' }}>
        <h2>Branding & Content</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Manage your website's identity and main visual elements</p>
      </div>

      <div style={{ maxWidth: '800px', marginBottom: '3rem' }}>
        {/* Hero Media Section */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' }}>
          <h3 style={{ margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', marginBottom: '1rem' }}>
            <Film size={20} style={{ color: '#6366f1' }} /> Hero Slider Media
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>Upload up to 3 high-resolution images for the home page slider</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[1, 2, 3].map(num => {
              const key = `hero_slide_${num}`;
              return (
                <div key={key} style={{ textAlign: 'center' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Slide {num}</label>
                  <div style={{ 
                    aspectRatio: '16/9', 
                    background: '#f8fafc', 
                    borderRadius: '1rem', 
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {content[key] ? (
                      <img src={`/api${content[key]}`} alt={`Slide ${num}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ImageIcon size={32} style={{ color: '#cbd5e1' }} />
                    )}
                  </div>
                  <input type="file" id={`upload-${key}`} onChange={(e) => handleFileUpload(e, key)} style={{ display: 'none' }} accept="image/*" />
                  <button className="btn-secondary" onClick={() => document.getElementById(`upload-${key}`).click()} style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem', gap: '0.25rem' }}>
                    <Upload size={14} /> {saving[key] ? '...' : 'Change'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {/* Logo Management */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' }}>
          <h3 style={{ margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', marginBottom: '1rem' }}>
            <Globe size={20} style={{ color: '#6366f1' }} /> Official Site Logo
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>Update the logo used in the header and footer across the site</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {content.site_logo && (
              <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '1rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <img src={`${content.site_logo}`} alt="Current Logo" style={{ maxHeight: '60px', objectFit: 'contain' }} />
              </div>
            )}
            <input type="file" id="logo-upload" onChange={(e) => handleFileUpload(e, 'site_logo')} style={{ display: 'none' }} accept="image/*" />
            <button className="action-btn" onClick={() => document.getElementById('logo-upload').click()} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px dashed #6366f1', background: 'rgba(99, 102, 241, 0.05)', color: '#6366f1', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Upload size={18} /> {saving.site_logo ? 'Uploading...' : 'Upload New Logo'}
            </button>
          </div>
        </div>

        <ContentCard title="Hero Title" sectionKey="home_hero_title" icon={ImageIcon} content={content} handleChange={handleChange} handleSave={handleSave} saving={saving} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <ContentCard title="Hero Subtitle" sectionKey="home_hero_subtitle" type="textarea" icon={ImageIcon} content={content} handleChange={handleChange} handleSave={handleSave} saving={saving} />
        <div style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' }}>
           <h3 style={{ margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', marginBottom: '1rem' }}>
            <Award size={20} style={{ color: '#6366f1' }} /> Impact Statistics
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>Update the metrics shown on the home page stats section</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             <div>
               <label style={{fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.25rem'}}>Countries Exported</label>
               <input type="text" value={content.stat_countries || ''} onChange={(e) => handleChange('stat_countries', e.target.value)} style={{width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0'}} placeholder="e.g. 50+"/>
             </div>
             <div>
               <label style={{fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.25rem'}}>Quality Score %</label>
               <input type="text" value={content.stat_quality || ''} onChange={(e) => handleChange('stat_quality', e.target.value)} style={{width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0'}} placeholder="e.g. 100%"/>
             </div>
             <div>
               <label style={{fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.25rem'}}>Happy Clients</label>
               <input type="text" value={content.stat_clients || ''} onChange={(e) => handleChange('stat_clients', e.target.value)} style={{width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0'}} placeholder="e.g. 1000+"/>
             </div>
             <div>
               <label style={{fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.25rem'}}>Years Experience</label>
               <input type="text" value={content.stat_years || ''} onChange={(e) => handleChange('stat_years', e.target.value)} style={{width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0'}} placeholder="e.g. 15+"/>
             </div>
          </div>
          <button onClick={() => {
            handleSave('stat_countries');
            handleSave('stat_quality');
            handleSave('stat_clients');
            handleSave('stat_years');
          }} className="btn-save" style={{width: '100%', marginTop: '1.5rem', justifyContent: 'center'}}>
            <Save size={16}/> Save All Stats
          </button>
        </div>
      </div>

      <div className="page-header" style={{ margin: '3rem 0 2rem' }}>
        <h2>About Us Details</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Update your company's About Us text and up to 5 photos/videos</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
        <ContentCard title="About Us Text" sectionKey="about_us_text" type="textarea" icon={Award} content={content} handleChange={handleChange} handleSave={handleSave} saving={saving} />
        
        <div style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' }}>
          <h3 style={{ margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', marginBottom: '1rem' }}>
            <Film size={20} style={{ color: '#6366f1' }} /> About Us Media
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>Upload up to 5 photos or videos to showcase your company.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
            {[1, 2, 3, 4, 5].map(num => {
              const key = `about_media_${num}`;
              const val = content[key];
              const isVideo = val && (val.endsWith('.mp4') || val.endsWith('.webm'));
              return (
                <div key={key} style={{ textAlign: 'center' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Media {num}</label>
                  <div style={{ 
                    aspectRatio: '1', 
                    background: '#f8fafc', 
                    borderRadius: '1rem', 
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {val ? (
                      isVideo ? (
                         <video src={`/api${val}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                         <img src={`/api${val}`} alt={`Media ${num}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )
                    ) : (
                      <ImageIcon size={32} style={{ color: '#cbd5e1' }} />
                    )}
                  </div>
                  <input type="file" id={`upload-${key}`} onChange={(e) => handleFileUpload(e, key)} style={{ display: 'none' }} accept="image/*,video/mp4,video/webm" />
                  <button className="btn-secondary" onClick={() => document.getElementById(`upload-${key}`).click()} style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem', gap: '0.25rem' }}>
                    <Upload size={14} /> {saving[key] ? '...' : (val ? 'Replace' : 'Upload')}
                  </button>
                  {val && (
                    <button onClick={() => { handleChange(key, ''); setTimeout(() => handleSave(key), 100); }} style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
                      Clear
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="page-header" style={{ margin: '3rem 0 2rem' }}>
        <h2>Contact & Socials</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Update your contact information and social media links</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <ContentCard title="Primary Email" sectionKey="contact_email" icon={Mail} content={content} handleChange={handleChange} handleSave={handleSave} saving={saving} />
        <ContentCard title="Support Email" sectionKey="contact_support_email" icon={Mail} content={content} handleChange={handleChange} handleSave={handleSave} saving={saving} />
        <ContentCard title="Contact Phone" sectionKey="contact_phone" icon={Phone} content={content} handleChange={handleChange} handleSave={handleSave} saving={saving} />
        <ContentCard title="Office Address" sectionKey="contact_address" type="textarea" icon={MapPin} content={content} handleChange={handleChange} handleSave={handleSave} saving={saving} />
        <ContentCard title="Facebook URL" sectionKey="social_facebook" icon={Facebook} content={content} handleChange={handleChange} handleSave={handleSave} saving={saving} />
        <ContentCard title="LinkedIn URL" sectionKey="social_linkedin" icon={Linkedin} content={content} handleChange={handleChange} handleSave={handleSave} saving={saving} />
      </div>

    </div>
  );
};

export default AdminContent;
