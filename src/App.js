import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SchemesOverview from './components/SchemesOverview';
import UserDashboard from './components/UserDashboard';
import AuthModal from './components/AuthModal';
import Chatbot from './components/Chatbot';
import './App.css';
import RegistrationVoiceForm from './components/RegistrationVoiceForm';
import MicrolendingPage from './components/MicrolendingPage';
import VoiceForm from './components/VoiceForm';
import MnregaForm from './components/MnregaForm';
import VoiceToMnregaForm from './components/VoiceToMnregaForm';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleLogin = (userData) => {
    console.log('Login successful:', userData); // Debug log
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    console.log('Logout'); // Debug log
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const openAuthModal = (mode) => {
    console.log('Opening auth modal:', mode); // Debug log
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage 
                isAuthenticated={isAuthenticated}
                currentUser={currentUser}
                onLogin={() => openAuthModal('login')}
                onSignup={() => openAuthModal('signup')}
                onLogout={handleLogout}
              />
            } 
          />
          <Route 
            path="/schemes"
            element={
              <SchemesOverview
                isAuthenticated={isAuthenticated}
                currentUser={currentUser}
                onLogin={() => openAuthModal('login')}
              />
            }
          />
          <Route
            path="/microlendingPage"
            element={
              <MicrolendingPage
                isAuthenticated={isAuthenticated}
                currentUser={currentUser}
                onLogin={() => openAuthModal('login')}
              />
            }
          />
          <Route
            path="/applyPMYojna"
            element={
              <VoiceToMnregaForm
                isAuthenticated={isAuthenticated}
                currentUser={currentUser}
                onLogin={() => openAuthModal('login')}
              />
            }
          />
          <Route
            path="/applyPMYojna"
            element={
              <MnregaForm
                isAuthenticated={isAuthenticated}
                currentUser={currentUser}
              />
            }
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <UserDashboard currentUser={currentUser} onLogout={handleLogout} /> :
              <Navigate to="/" replace />
            } 
          />
        </Routes>

        {showAuthModal && (
          <AuthModal
            mode={authMode}
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
            onSwitchMode={(mode) => setAuthMode(mode)}
          />
        )}
        
        <Chatbot 
          currentUser={currentUser} 
          isAuthenticated={isAuthenticated} 
        />
      </div>
    </Router>
  );
}

export default App;
