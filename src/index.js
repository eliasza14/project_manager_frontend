import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// PrimeReact core styles
import 'primereact/resources/themes/lara-light-blue/theme.css'; // or another theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Optional: PrimeFlex if you use utility classes
import 'primeflex/primeflex.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
