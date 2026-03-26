import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
};

import AdminLayout from './layouts/AdminLayout';
import Login from './pages/admin/Login';
import Signup from './pages/admin/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminContent from './pages/admin/AdminContent';
import AdminBlog from './pages/admin/AdminBlog';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminCategories from './pages/admin/AdminCategories';

import PublicLayout from './layouts/PublicLayout';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Products from './pages/public/Products';
import Blog from './pages/public/Blog';
import Contact from './pages/public/Contact';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/signup" element={<Signup />} />

          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><AdminLayout><AdminProducts /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/content" element={<ProtectedRoute><AdminLayout><AdminContent /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/blog" element={<ProtectedRoute><AdminLayout><AdminBlog /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute><AdminLayout><AdminCategories /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/inquiries" element={<ProtectedRoute><AdminLayout><AdminInquiries /></AdminLayout></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
