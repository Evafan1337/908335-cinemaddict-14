import FilmsPresenter from './presenter/films';
import EmptyPresenter from './presenter/empty';
import FooterPresenter from './presenter/footer';
import {generateFilms} from './mock/film';
import {filmsInfoSort, getFilmsInfoSortLength} from './utils';

const FILM_COUNT = 48;

const films = generateFilms(FILM_COUNT);
const sortInfo = filmsInfoSort(films);
const sortInfoLength = getFilmsInfoSortLength(sortInfo);

const siteBody = document.querySelector('body');
const siteMainElement = siteBody.querySelector('.main');
const siteFooterStatistics = siteBody.querySelector('.footer__statistics');

const filmsPresenter = new FilmsPresenter(siteMainElement);
const emptyPresenter = new EmptyPresenter(siteMainElement);


if (films.length > 0) {
  filmsPresenter.init(films, sortInfoLength);
} else {
  emptyPresenter.init(sortInfoLength);
}

const footerPresenter = new FooterPresenter(siteFooterStatistics);
footerPresenter.init(FILM_COUNT);
