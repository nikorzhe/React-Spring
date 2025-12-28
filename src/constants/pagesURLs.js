import * as pages from './pages';
import config from 'config';

const UI_PREFIX = config.UI_URL_PREFIX || '';

const pageURLs = {
  [pages.defaultPage]: `${UI_PREFIX}/`,
  [pages.detailsPage]: `${UI_PREFIX}/books`,
  [pages.secretPage]: `${UI_PREFIX}/secret`,
  [pages.login]: `${UI_PREFIX}/login`,
};

export default pageURLs;
