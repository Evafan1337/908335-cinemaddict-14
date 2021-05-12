import {generateFilms} from './mock/film';
import PagePresenter from './presenter/pagePresenter';

// const FILM_COUNT = 0;
// const FILM_COUNT = 22;
const FILM_COUNT = 7;

const films = generateFilms(FILM_COUNT);

const siteBody = document.querySelector('body');
const siteMainElement = siteBody.querySelector('.main');
const siteFooterStatistics = siteBody.querySelector('.footer__statistics');

const pagePresenter = new PagePresenter(siteBody, siteMainElement, siteFooterStatistics, films);
pagePresenter.init();
