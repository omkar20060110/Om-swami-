import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';
// Leveraging styles from AdminProducts.css

const AdminTraining = () => {
    const [trainings, setTrainings] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', duration: '', fees: '', modules: '' });
  
    const fetchData = async () => {
      const res = await axios.get('/api/training');
      setTrainings(res.data);
    };
  
    useEffect(() => { fetchData(); }, []);
  
    const openModal = (prog = null) => {
      if (prog) {
        setFormData(prog);
        setEditingId(prog.id);
      } else {
        setFormData({ title: '', description: '', duration: '', fees: '', modules: '' });
        setEditingId(null);
      }
      setIsModalOpen(true);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (editingId) {
         // update logic
      } else {
        await axios.post('/api/training', formData);
      }
      setIsModalOpen(false);
      fetchData();
    };
  
    return (
      <div className="admin-page animate-fade-in">
        <div className="page-header">
          <h2>Manage Training Programs</h2>
          <button className="btn-primary" onClick={() => openModal()}>
            <Plus size={18} /> Add New Program
          </button>
        </div>
  
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Duration</th>
                <th>Fees</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainings.map(p => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.duration || '-'}</td>
                  <td>{p.fees || '-'}</td>
                  <td>{p.is_active ? 'Active' : 'Disabled'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn edit" onClick={() => openModal(p)}><Edit size={16}/></button>
                      <button className="icon-btn delete"><Trash2 size={16}/></button>
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
              <h3>{editingId ? 'Edit Program' : 'Add New Program'}</h3>
              <form onSubmit={handleSubmit} className="modal-form">
                <input type="text" placeholder="Program Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                
                <div className="form-row">
                  <input type="text" placeholder="Duration (e.g. 3 Months)" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                  <input type="text" placeholder="Fees" value={formData.fees} onChange={e => setFormData({...formData, fees: e.target.value})} />
                </div>
  
                <textarea placeholder="Program Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="4" required />
                <textarea placeholder="Modules (comma separated)" value={formData.modules} onChange={e => setFormData({...formData, modules: e.target.value})} rows="3" />
                
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Save Program</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
};
export default AdminTraining;
