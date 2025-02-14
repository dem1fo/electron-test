// src/renderer.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.js'
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw Error("ERROR: Cannot find root element in DOM");

const root = createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);