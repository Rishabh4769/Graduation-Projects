import React from 'react';
import ReactDOM from 'react-dom/client';

/* Bootstrap (CSS + JS bundle) */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Show server status message
console.log('🌟 Frontend running at http://localhost:3000');
console.log('📡 API proxy: http://localhost:5050');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();