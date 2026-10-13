import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Auth/Login';
import Privateroutes from './Privateroutes';
import { handleRedirectAuth } from './auth/authConfig';

function App() {
  const [processingAuth, setProcessingAuth] = useState(() => {
    return typeof window !== 'undefined' && (
      window.location.hash.includes('code=') ||
      window.location.hash.includes('error=') ||
      window.location.search.includes('code=') ||
      window.location.search.includes('error=')
    );
  });

  useEffect(() => {
    const processGlobalRedirect = async () => {
      try {
        const response = await handleRedirectAuth();
        if (response && response.account) {
          localStorage.setItem('is_logged', 'true');
          const role = response.account.idTokenClaims?.roles?.[0] || 'user';
          localStorage.setItem('role', role);
          localStorage.setItem('auth_provider', 'azure');
          localStorage.setItem('user_email', response.account.username || response.account.idTokenClaims?.email || '');
          localStorage.setItem('user_name', response.account.name || '');
          localStorage.setItem('user', JSON.stringify({
            name: response.account.name,
            email: response.account.username || response.account.idTokenClaims?.email,
            role: role,
            provider: 'azure-sso'
          }));

          // Clean auth code from URL bar without triggering hard reload
          if (window.history && window.history.replaceState) {
            window.history.replaceState({}, document.title, '/');
          }
        }
      } catch (err) {
        console.warn('Global redirect handling error:', err);
      } finally {
        setProcessingAuth(false);
      }
    };

    processGlobalRedirect();
  }, []);

  if (processingAuth) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white">
        <div className="spinner-border text-primary mb-3" role="status" />
        <p style={{ fontSize: '14px', letterSpacing: '0.5px' }}>Signing in to Intelgenz via Azure SSO...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/*" element={<Privateroutes />} />
      </Routes>
    </>
  );
}

export default App;
