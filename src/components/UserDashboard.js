import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockSchemes, extraSchemes } from '../utils/mockData';

import '../styles/UserDashboard.css';

const UserDashboard = ({ currentUser, onLogout }) => {
  const [selectedScheme, setSelectedScheme] = useState(null);

  const availableSchemes = currentUser?.isNewUser ? 
    mockSchemes.slice(0, 2) : 
    mockSchemes;

  const greyedOutSchemes = currentUser?.isNewUser ? 
    mockSchemes.slice(2) : 
    [];
const allSchemes = [...mockSchemes, ...extraSchemes]; 
  const getCreditScoreColor = (score) => {
    if (score >= 750) return '#4caf50';
    if (score >= 650) return '#ff9800';
    return '#f44336';
  };

      const navigate = useNavigate();

  const handlePmYojnaApply = () => {
          navigate('/applyPMYojna');
      };


  const SchemeCard = ({ scheme, isDisabled = false }) => (
    <div 
      className={`scheme-card ${isDisabled ? 'disabled' : ''}`}
      onClick={() => !isDisabled && setSelectedScheme(scheme)}
    >
      <div className="scheme-header">
        <h3>{scheme.name}</h3>
        <span className={`category-badge ${scheme.category.toLowerCase()}`}>
          {scheme.category}
        </span>
      </div>
      <p className="scheme-description">{scheme.description}</p>
      {!isDisabled && (
        <div className="scheme-actions">
          <button className="apply-btn">Apply Now</button>
          <button className="details-btn">View Details</button>
        </div>
      )}
      {isDisabled && (
        <div className="disabled-overlay">
          <p>Complete profile verification to unlock</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="user-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="header-left">
            <Link to="/" className="logo">DbAwaaZ</Link>
            <h1>Welcome, {currentUser?.name}</h1>
          </div>
          <div className="header-right">
            <Link to="/schemes" className="nav-link">All Schemes</Link>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="user">
        {/* Credit Score Section */}

        <section className="credit-score-section">
        <div className="credit-score-card">
                    <h2>Your Information</h2>
                    <div className="score-display">
                      <div
                        className="score-circle"
                        style={{ borderColor: getCreditScoreColor(currentUser?.creditScore) }}
                      >
                        <img
                            src="/user.png"
                            alt="User Icon"
                            className="score-icon"
                          />
                      </div>
                      <div className="score-info">
                        <p className="score-status">
                          {currentUser?.name}
                        </p>
                        <p className="score-description">
                          Referral id : 1234567890
                        </p>
                      </div>
                    </div>
                    <div className="score-tips">
                      <h4>KYC Details</h4>
                      <ul>
                        <li>Pan : ABCDE1234K</li>
                        <li>AADHAR : 123456789098</li>
                        <li>Contact : +91 1234567890</li>
                        <li>Address : 32, kharkauni village, near Kesari shop, Rampur, 12345, IN</li>

                      </ul>
                    </div>
                  </div>

          <div className="credit-score-card">
            <h2>Your Credit Score</h2>
            <div className="score-display">
              <div
                className="score-circle"
                style={{ borderColor: getCreditScoreColor(currentUser?.creditScore) }}
              >
                <span className="score-number">{currentUser?.creditScore}</span>
              </div>
              <div className="score-info">
                <p className="score-status">
                  {currentUser?.creditScore >= 750 ? 'Excellent' :
                   currentUser?.creditScore >= 650 ? 'Good' : 'Fair'}
                </p>
                <p className="score-description">
                  Your credit score affects loan eligibility and interest rates
                </p>
              </div>
            </div>
            <div className="score-tips">
              <h4>Improvement Tips:</h4>
              <ul>
                <li>Pay bills on time</li>
                <li>Keep credit utilization low</li>
                <li>Maintain old credit accounts</li>
              </ul>
            </div>
            <div>
            <Link to="/microlendingPage" className="offer-btn">Apply for Micro Loan</Link>
            </div>
          </div>
        </section>
        {/* Available Schemes */}
        <section className="schemes-section">
          <h2>Available Schemes ({availableSchemes.length} of {mockSchemes.length})</h2>
          <div className="schemes-grid">
            {availableSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
            {greyedOutSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} isDisabled={true} />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn">
              <span className="action-icon">📄</span>
              View Statements
            </button>
            <button className="action-btn">
              <span className="action-icon">💸</span>
              Transfer Money
            </button>
            <button className="action-btn">
              <span className="action-icon">💰</span>
              Check Balance
            </button>
            <button className="action-btn">
              <span className="action-icon">🏪</span>
              Cash Withdrawal
            </button>
            <button className="action-btn">
              <span className="action-icon">📞</span>
              Customer Support
            </button>
            <button className="action-btn">
              <span className="action-icon">💳</span>
              Microlending
            </button>
          </div>
        </section>

        {/* Profile Completion */}
        {currentUser?.isNewUser && (
          <section className="profile-completion">
            <h2>Complete Your Profile</h2>
            <div className="completion-card">
              <p>Complete your profile to unlock all schemes and features</p>
              <div className="completion-steps">
                <div className="step completed">
                  <span className="step-icon">✓</span>
                  Basic Information
                </div>
                <div className="step pending">
                  <span className="step-icon">○</span>
                  Income Verification
                </div>
                <div className="step pending">
                  <span className="step-icon">○</span>
                  Document Upload
                </div>
              </div>
              <button className="complete-profile-btn">Complete Profile</button>
            </div>
          </section>
        )}
      </div>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div className="modal-overlay" onClick={() => setSelectedScheme(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedScheme.name}</h2>
              <button 
                className="close-btn" 
                onClick={() => setSelectedScheme(null)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>{selectedScheme.description}</p>
              <div className="scheme-benefits">
                <h4>Benefits:</h4>
                <ul>
                  {selectedScheme.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
              <div className="scheme-actions">
                <button onClick={handlePmYojnaApply} className="apply-btn">Apply Now</button>
                <button className="learn-more-btn">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
