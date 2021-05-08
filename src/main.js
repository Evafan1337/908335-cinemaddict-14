import RatedFilmsPresenter from './presenter/ratedFilms';
import CommentedFilmsPresenter from './presenter/commentedFilms';
import FilmsPresenter from './presenter/films';
import EmptyPresenter from './presenter/empty';
import {generateFilms} from './mock/film';
import {render} from './utils/render';
import FooterStatisticsView from './view/count-films';

// const FILM_COUNT = 0;
const FILM_COUNT = 22;

const films = generateFilms(FILM_COUNT);
const filmsCount = films.length;

const siteBody = document.querySelector('body');
const siteMainElement = siteBody.querySelector('.main');
const siteFooterStatistics = siteBody.querySelector('.footer__statistics');

const filmsPresenter = new FilmsPresenter(siteMainElement);
const emptyPresenter = new EmptyPresenter(siteMainElement);

//	check later
//	main presenter?
if (filmsCount > 0) {
  filmsPresenter.init(films);
  const ratedFilmsPresenter = new RatedFilmsPresenter(siteMainElement);
  const commentedFilmsPresenter = new CommentedFilmsPresenter(siteMainElement);
  ratedFilmsPresenter.init(films);
  commentedFilmsPresenter.init(films);
} else {
  // Замена презентера на обычный компонент (стоит ли?)
  emptyPresenter.init();

}

// Замена презентера на обычный компонент
// const footerPresenter = new FooterPresenter(siteFooterStatistics);
// footerPresenter.init(filmsCount);

render(siteFooterStatistics, new FooterStatisticsView(filmsCount));
