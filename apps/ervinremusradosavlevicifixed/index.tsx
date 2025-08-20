/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { ToastProvider } from './components/ToastProvider';
import { LoginScreen } from './components/LoginScreen';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const Main = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LoginScreen onAcknowledge={() => setIsAuthenticated(true)} />;
  }
  
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  );
};

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);