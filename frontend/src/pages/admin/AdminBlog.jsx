import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Upload, X as XIcon, Image as ImageIcon } from 'lucide-react';

const AdminBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '', additional_images: [] });
    const [uploading, setUploading] = useState(false);
  
    const fetchData = async () => {
      const res = await axios.get('/api/blog');
      setBlogs(res.data);
    };
  
    useEffect(() => { fetchData(); }, []);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (editingId) {
          await axios.put(`/api/blog/${editingId}`, formData);
        } else {
          await axios.post('/api/blog', formData);
        }
        setIsModalOpen(false);
        fetchData();
      } catch (err) {
        console.error('Error saving post', err);
        alert('Failed to save post');
      }
    };

    const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this post?')) {
        try {
          await axios.delete(`/api/blog/${id}`);
          fetchData();
        } catch (err) {
          console.error('Error deleting', err);
        }
      }
    };

    const handleEdit = (blog) => {
      setFormData({
        title: blog.title,
        content: blog.content,
        additional_images: blog.additional_images || []
      });
      setEditingId(blog.id);
      setIsModalOpen(true);
    };

    const handleFileUpload = async (event) => {
      const files = Array.from(event.target.files);
      if (!files.length) return;

      if (formData.additional_images.length + files.length > 5) {
        alert('You can only upload up to 5 media files per post.');
        return;
      }

      setUploading(true);
      try {
        const uploadedUrls = [];
        for (let file of files) {
          const uploadData = new FormData();
          uploadData.append('file', file);
          const res = await axios.post('/api/upload', uploadData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          uploadedUrls.push(res.data.url);
        }
        setFormData(prev => ({
          ...prev,
          additional_images: [...prev.additional_images, ...uploadedUrls]
        }));
      } catch (err) {
        console.error('Upload failed', err);
        alert('One or more files failed to upload.');
      }
      setUploading(false);
    };

    const removeMedia = (index) => {
      setFormData(prev => ({
        ...prev,
        additional_images: prev.additional_images.filter((_, i) => i !== index)
      }));
    };
  
    return (
      <div className="admin-page animate-fade-in">
        <div className="page-header">
          <h2>Manage Resources (Blog)</h2>
          <button className="btn-primary" onClick={() => { 
            setFormData({ title: '', content: '', additional_images: [] }); 
            setEditingId(null); 
            setIsModalOpen(true); 
          }}>
            <Plus size={18} /> Add New Post
          </button>
        </div>
  
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Media Info</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(b => (
                <tr key={b.id}>
                  <td>{b.title}</td>
                  <td>{(b.additional_images || []).length} items attached</td>
                  <td>{b.created_at}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn edit" onClick={() => handleEdit(b)}><Edit size={16}/></button>
                      <button className="icon-btn delete" onClick={() => handleDelete(b.id)}><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No posts available.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content animate-slide-up" style={{ maxWidth: '700px', width: '90%' }}>
              <h3>{editingId ? 'Edit Post' : 'Add New Post'}</h3>
              <form onSubmit={handleSubmit} className="modal-form">
                <input type="text" placeholder="Post Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                <textarea placeholder="Post Content" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows="8" required />
                
                {/* Media Section */}
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b' }}>
                      <ImageIcon size={18} /> Upload Media (up to 5)
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{formData.additional_images.length} / 5</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {formData.additional_images.map((url, i) => {
                      const isVideo = url.endsWith('.mp4') || url.endsWith('.webm');
                      return (
                        <div key={i} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                          {isVideo ? (
                             <video src={`/api${url}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                             <img src={`/api${url}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Media" />
                          )}
                          <button type="button" onClick={() => removeMedia(i)} style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', cursor: 'pointer', padding: '0.1rem', borderRadius: '0 0 0 0.25rem' }}>
                            <XIcon size={12} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  
                  {formData.additional_images.length < 5 && (
                    <>
                      <input type="file" id="media-upload" multiple accept="image/*,video/mp4,video/webm" onChange={handleFileUpload} style={{ display: 'none' }} />
                      <button type="button" className="btn-secondary" onClick={() => document.getElementById('media-upload').click()} disabled={uploading} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        <Upload size={16} /> {uploading ? 'Uploading...' : 'Add Photos/Videos'}
                      </button>
                    </>
                  )}
                </div>

                <div className="modal-actions" style={{ marginTop: '2rem' }}>
                  <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={uploading}>
                    {editingId ? 'Update Post' : 'Save Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
};
export default AdminBlog;
