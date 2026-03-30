import React from 'react';
import ReactDOM from 'react-dom/client';
import { BillProvider } from './context/BillContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BillProvider>
      <App />
    </BillProvider>
  </React.StrictMode>
);