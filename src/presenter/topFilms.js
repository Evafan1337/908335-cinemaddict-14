import FilmCardPresenter from './filmCard';

const FILM_RATED_COUNT = 2;

export default class FilmsTopPresenter {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._films = null;
  }

  init(films) {
    this._films = films;
    this._renderFilmsContainer();
  }

  _renderFilmsContainer() {
    for (let i = 0; i < FILM_RATED_COUNT; i++) {
      this._renderCard(this._films[i]);
    }
  }

  _renderCard(film) {
    const filmCardPresenter = new FilmCardPresenter(this._filmsContainer);
    filmCardPresenter.init(film);
  }
}
