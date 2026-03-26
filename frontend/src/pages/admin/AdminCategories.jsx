import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchData = async () => {
    const res = await axios.get('/api/categories');
    setCategories(res.data);
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (cat = null) => {
    if (cat) {
      setFormData({ name: cat.name, description: cat.description });
      setEditingId(cat.id);
    } else {
      setFormData({ name: '', description: '' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/categories/${editingId}`, formData);
      } else {
        await axios.post('/api/categories', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category? This might affect products using it.')) {
      try {
        await axios.delete(`/api/categories/${id}`);
        fetchData();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  return (
    <div className="admin-page animate-fade-in">
      <div className="page-header">
        <h2>Manage Categories</h2>
        <button className="btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 'bold' }}>{c.name}</td>
                <td>{c.description || '-'}</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn edit" onClick={() => openModal(c)}><Edit size={16}/></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(c.id)}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-slide-up">
            <h3>{editingId ? 'Edit Category' : 'Add Category'}</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              <input 
                type="text" 
                placeholder="Category Name" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
              <textarea 
                placeholder="Description" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                rows="3" 
              />
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
