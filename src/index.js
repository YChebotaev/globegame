import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import LocaleProvider from "./i18n";
import ErrorBoundary from './components/ErrorBoundary'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ErrorBoundary>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </ErrorBoundary>
);
