import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const PageTitle = ({ titleKey }) => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t(titleKey);
  }, [t, titleKey]);

  return null;
};

export default PageTitle;
