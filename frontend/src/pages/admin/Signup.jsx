import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import './AdminLogin.css'; // Reusing styles

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      setSuccess(true);
      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-card animate-slide-up">
        <div className="login-header">
          <div className="login-icon">
            <UserPlus size={32} />
          </div>
          <h1>Create Account</h1>
          <p>Join Swami Samarth Global Exports</p>
        </div>

        {error && (
          <div className="error-badge">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-badge" style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle size={18} />
            <span>Registration successful! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <User size={18} className="icon" />
              <input
                type="text"
                id="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="icon" />
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="icon" />
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="icon" />
              <input
                type="password"
                id="confirmPassword"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading || success}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="login-footer">
          <p>Already have an account? <Link to="/admin/login">Log In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
