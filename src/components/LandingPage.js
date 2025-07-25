import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = ({ isAuthenticated, currentUser, onLogin, onSignup, onLogout }) => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h2>DbAwaaZ</h2>
          </div>
          <nav className="nav-menu">
            {isAuthenticated ? (
              <div className="user-menu">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <span className="user-name">Welcome, {currentUser?.name}</span>
                <button onClick={onLogout} className="auth-btn logout-btn">Logout</button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button onClick={onLogin} className="auth-btn login-btn">Login</button>
                <button onClick={onSignup} className="auth-btn signup-btn">Sign Up</button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h2>Your Voice For New Hope</h2>
            <p>Access government schemes, banking services, and financial tools all in one place</p>
          </div>
        </div>
      </section>

      <section className="special-offers">
        <div className="container">
          <div className="offers-grid">
            <div className="offer-card">
              <h3>Microlending</h3>
              <p>Get attractive interest rates starting from 2% per annum</p>
              <Link to="/microlendingPage" className="offer-btn">Apply Now</Link>
            </div>
            <div className="offer-card">
              <h3>Explore Schemes</h3>
              <p>Explore all schemes at one place</p>
              <Link to="/schemes" className="offer-btn">Explore</Link>
            </div>
            <div className="offer-card">
              <h3>Village ATM Agents</h3>
              <p>Withdraw cash in minutes</p>
              <button className="offer-btn">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Banking Services */}
      <section className="banking-services">
        <div className="container">
          <h2>Our Banking Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🔒</div>
              <h3>Secure Transactions</h3>
              <p>End-to-end encryption for all your transactions</p>
            </div>
            <div className="service-card">
              <div className="service-icon">📱</div>
              <h3>Mobile Banking</h3>
              <p>USSD-based banking accessible without internet</p>
            </div>
            <div className="service-card">
              <div className="service-icon">💰</div>
              <h3>Savings Account</h3>
              <p>Zero balance accounts with exclusive benefits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="quick-access">
        <div className="container">
          <h2>Quick Access</h2>
          <div className="quick-grid">
            <button className="quick-btn">View Statement</button>
            <button className="quick-btn">Customer Support</button>
            <button className="quick-btn">Transfer Money</button>
            <button className="quick-btn">Check Balance</button>
            <button className="quick-btn">Cash Withdrawal</button>
            <button className="quick-btn">Microlending</button>
          </div>
        </div>
      </section>

      {/* Limited Time Offer Banner */}
      <section className="limited-offer">
        <div className="container">
          <div className="offer-banner">
            <h3>Limited Time Offer!</h3>
            <p>Open a new savings account and get instant benefits worth ₹5,000</p>
            <button onClick={onSignup} className="banner-btn">Sign Up Now</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 DbAwaaZ. All rights reserved. | Empowering Financial Inclusion</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
