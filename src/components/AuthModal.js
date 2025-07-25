import React, { useState } from 'react';
import '../styles/AuthModal.css';
import {  useNavigate } from 'react-router-dom';

const AuthModal = ({ mode, onClose, onLogin, onSwitchMode }) => {
  const [formData, setFormData] = useState({
    userId: '',
    pan: '',
    aadhaar: '',
    mpin: '',
    confirmMpin: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
const navigate = useNavigate();
const naviagetDashboard = () => {
    navigate('/dashboard');
    };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.userId) {
      newErrors.userId = 'User ID is required';
    }

    if (mode === 'signup') {
      if (!formData.pan || formData.pan.length !== 10) {
        newErrors.pan = 'Valid PAN number is required (10 characters)';
      }
      if (!formData.aadhaar || formData.aadhaar.length !== 12) {
        newErrors.aadhaar = 'Valid Aadhaar number is required (12 digits)';
      }
    }

    if (!formData.mpin || formData.mpin.length < 4) {
      newErrors.mpin = 'MPIN must be at least 4 digits';
    }

    if (mode === 'signup' && formData.mpin !== formData.confirmMpin) {
      newErrors.confirmMpin = 'MPIN does not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Mock authentication - in real app, this would call an API
      const userData = {
        userId: formData.userId,
        name: mode === 'signup' ? 'Archana' : 'Sita Devi',
        isNewUser: mode === 'signup',
        creditScore: mode === 'signup' ? 650 : 720,
        availableSchemes: mode === 'signup' ? 2 : 6
      };
      onLogin(userData);
      naviagetDashboard()
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="userId">User ID</label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              className={errors.userId ? 'error' : ''}
              placeholder="Enter your User ID"
            />
            {errors.userId && <span className="error-text">{errors.userId}</span>}
          </div>

          {mode === 'signup' && (
            <>
              <div className="form-group">
                <label htmlFor="pan">PAN Number</label>
                <input
                  type="text"
                  id="pan"
                  name="pan"
                  value={formData.pan}
                  onChange={handleInputChange}
                  className={errors.pan ? 'error' : ''}
                  placeholder="Enter PAN number"
                  maxLength="10"
                />
                {errors.pan && <span className="error-text">{errors.pan}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="aadhaar">Aadhaar Number</label>
                <input
                  type="text"
                  id="aadhaar"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleInputChange}
                  className={errors.aadhaar ? 'error' : ''}
                  placeholder="Enter Aadhaar number"
                  maxLength="12"
                />
                {errors.aadhaar && <span className="error-text">{errors.aadhaar}</span>}
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="mpin">MPIN</label>
            <input
              type="password"
              id="mpin"
              name="mpin"
              value={formData.mpin}
              onChange={handleInputChange}
              className={errors.mpin ? 'error' : ''}
              placeholder="Enter 4-6 digit MPIN"
              maxLength="6"
            />
            {errors.mpin && <span className="error-text">{errors.mpin}</span>}
          </div>

          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="confirmMpin">Confirm MPIN</label>
              <input
                type="password"
                id="confirmMpin"
                name="confirmMpin"
                value={formData.confirmMpin}
                onChange={handleInputChange}
                className={errors.confirmMpin ? 'error' : ''}
                placeholder="Confirm your MPIN"
                maxLength="6"
              />
              {errors.confirmMpin && <span className="error-text">{errors.confirmMpin}</span>}
            </div>
          )}

          <button type="submit" className="submit-btn">
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="modal-footer">
          {mode === 'login' ? (
            <p>
              New user?
              <button
                type="button"
                className="link-btn"
                onClick={() => onSwitchMode('signup')}
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?
              <button
                type="button"
                className="link-btn"
                onClick={() => onSwitchMode('login')}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
