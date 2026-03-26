import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Package, FileText, 
  GraduationCap, Users, LogOut, Settings, MessageSquare 
} from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>Admin Panel</h2>
          <p className="role-badge">{user?.role || 'Admin'}</p>
        </div>
        
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          
          <NavLink to="/admin/products" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <Package size={20} /> Products
          </NavLink>

          <NavLink to="/admin/categories" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <Settings size={20} /> Categories
          </NavLink>

          <NavLink to="/admin/content" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <FileText size={20} /> Content
          </NavLink>

          <NavLink to="/admin/blog" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <Settings size={20} /> Blog
          </NavLink>
          
          <NavLink to="/admin/inquiries" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <MessageSquare size={20} /> Inquiries
          </NavLink>
        </nav>

        <div className="admin-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h3>Welcome back, Super Admin</h3>
        </header>
        <div className="admin-content-area">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
