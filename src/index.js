import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import LocaleProvider from "./i18n";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <LocaleProvider>
    <App />
  </LocaleProvider>
);
