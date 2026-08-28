import React from 'react';
import ReactDOM from 'react-dom/client';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledEngineProvider } from '@mui/material/styles';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n';
import { isRtl } from './i18n';

// Reads the language from context rather than at module load, so switching to
// Arabic and back flips the document direction with it.
const DirectionProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const direction = isRtl(i18n.language) ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;
  }, [direction, i18n.language]);

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

// Pass a callback to start reporting Core Web Vitals, for example
// reportWebVitals(console.log) or a function that posts to an analytics endpoint.
reportWebVitals();
