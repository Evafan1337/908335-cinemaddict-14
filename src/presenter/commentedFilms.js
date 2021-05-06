import FilmsPresenter from './films';
import {compareValues} from '../utils';

const FILM_PER_PAGE = 2;
const siteBody = document.querySelector('body');

export default class CommentedFilmsPresenter extends FilmsPresenter {
  constructor(filmsContainer) {
    super();
    this._filmsContainer = filmsContainer;
    this._mainFilmList = siteBody.querySelector('.js-film-list-commented');
  }

  init(films) {
    this._films = films.slice().sort(compareValues('comments', 'desc')).slice(0, FILM_PER_PAGE);
    this._renderFilmsContainer();
  }

  _renderFilmsContainer() {
    this._renderFilms();
  }

  _renderFilms() {
    this._renderFilmList();
  }

  _renderFilmList() {
    this._films
      .slice()
      .forEach((film) => this._renderCard(film, this._mainFilmList));
  }

}