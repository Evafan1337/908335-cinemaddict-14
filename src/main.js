import FilmsPresenter from './presenter/films';
import EmptyPresenter from './presenter/empty';
import FooterPresenter from './presenter/footer';
import {generateFilms} from './mock/film';
import {filmsInfoSort, getFilmsInfoSortLength, render} from './utils';

import FooterStatisticsView from './view/count-films';
import EmptyFilmsView from './view/empty-films';

// const FILM_COUNT = 0;
const FILM_COUNT = 22;

const films = generateFilms(FILM_COUNT);
const filmsCount = films.length;
const sortInfo = filmsInfoSort(films);
const sortInfoLength = getFilmsInfoSortLength(sortInfo);

console.log(sortInfoLength);

const siteBody = document.querySelector('body');
const siteMainElement = siteBody.querySelector('.main');
const siteFooterStatistics = siteBody.querySelector('.footer__statistics');

const filmsPresenter = new FilmsPresenter(siteMainElement);
const emptyPresenter = new EmptyPresenter(siteMainElement);


if (filmsCount > 0) {
  filmsPresenter.init(films, sortInfoLength);
} else {
  // Замена презентера на обычный компонент
  emptyPresenter.init(sortInfoLength);

}

// Замена презентера на обычный компонент
// const footerPresenter = new FooterPresenter(siteFooterStatistics);
// footerPresenter.init(filmsCount);

render(siteFooterStatistics, new FooterStatisticsView(filmsCount));
