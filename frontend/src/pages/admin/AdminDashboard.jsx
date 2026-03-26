import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, Users, MessageSquare, BookOpen } from 'lucide-react';
import './AdminDashboard.css';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="stat-card">
    <div className="stat-content">
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
    <div className={`stat-icon bg-${color}`}>
      <Icon size={24} color="white" />
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, inquiries: 0, blogs: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, inqRes, blogRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/inquiries'),
          axios.get('/api/blog')
        ]);
        setStats({
          products: prodRes.data.length,
          inquiries: inqRes.data.length,
          blogs: blogRes.data.length
        });
      } catch (err) {
        console.error('Error fetching stats', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="stats-grid">
        <StatCard title="Total Products" value={stats.products} icon={Package} color="blue" />
        <StatCard title="New Inquiries" value={stats.inquiries} icon={MessageSquare} color="orange" />
        <StatCard title="Blog Posts" value={stats.blogs} icon={BookOpen} color="green" />
        <StatCard title="Site Visitors" value="2.4k" icon={Users} color="purple" />
      </div>
      <div className="dashboard-recent">
        <div className="recent-section">
          <h3>Quick Actions</h3>
          <div className="action-grid">
            <button className="action-btn" onClick={() => navigate('/admin/products')}>
               + Add New Product
            </button>
            <button className="action-btn" onClick={() => navigate('/admin/content')}>
               Review Content
            </button>
            <button className="action-btn" onClick={() => navigate('/admin/inquiries')}>
               Check Inquiries
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
