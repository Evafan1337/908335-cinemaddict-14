import PagePresenter from './presenter/pagePresenter';

import Api from './api';

const siteBody = document.querySelector('body');
const siteMainElement = siteBody.querySelector('.main');
const siteFooterStatistics = siteBody.querySelector('.footer__statistics');

const AUTHORIZATION = 'Basic aS2sd3dfSwcl1sa2j';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';
const api = new Api(END_POINT, AUTHORIZATION);

api.getFilms().then((films) => {
  const pagePresenter = new PagePresenter(siteBody, siteMainElement, siteFooterStatistics, films, api);
  pagePresenter.init();
});
