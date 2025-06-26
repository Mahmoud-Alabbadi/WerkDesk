import React, { Suspense } from 'react';
    import ReactDOM from 'react-dom/client';
    import App from '@/App';
    import '@/index.css';
    import { BrowserRouter as Router } from 'react-router-dom';
    import { AuthProvider } from '@/contexts/AuthContext';
    import './i18n'; // Import i18n configuration

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <Suspense fallback="loading...">
          <Router>
            <AuthProvider>
              <App />
            </AuthProvider>
          </Router>
        </Suspense>
      </React.StrictMode>
    );