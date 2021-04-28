import MenuPresenter from './presenter/menu';
import SortPresenter from './presenter/sort';
import FilmsPresenter from './presenter/films';
import EmptyPresenter from './presenter/empty';
import FooterPresenter from './presenter/footer';
import {generateFilms} from './mock/film';
import {filmsInfoSort} from './utils';

const FILM_COUNT = 48;

const films = generateFilms(FILM_COUNT);
const sortInfo = filmsInfoSort(films);

const siteBody = document.querySelector('body');
const siteMainElement = siteBody.querySelector('.main');
const siteFooterStatistics = siteBody.querySelector('.footer__statistics');

const menuPresenter = new MenuPresenter(siteMainElement);
const sortPresenter = new SortPresenter(siteMainElement);
const filmsPresenter = new FilmsPresenter(siteMainElement);
const emptyPresenter = new EmptyPresenter(siteMainElement);

menuPresenter.init(sortInfo);

if (films.length > 0) {
  sortPresenter.init();
  filmsPresenter.init(films);
} else {
  emptyPresenter.init();
}

const footerPresenter = new FooterPresenter(siteFooterStatistics);
footerPresenter.init(FILM_COUNT);