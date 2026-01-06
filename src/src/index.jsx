import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import i18n from "./i18n";
import { StyledEngineProvider } from '@mui/system';

const DirectionProvider = ({ children }) => {
  const direction = ['ar'].includes(i18n.language) ? 'rtl' : 'ltr';
  document.documentElement.dir = direction;

  return <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DirectionProvider>
      <App />
    </DirectionProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
