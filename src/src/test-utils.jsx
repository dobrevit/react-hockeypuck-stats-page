import React from 'react';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const customRender = (ui, options) =>
  render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>, options);

export * from '@testing-library/react';
export { customRender as render };
