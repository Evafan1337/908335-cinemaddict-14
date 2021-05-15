import Observer from './observer';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
    this._notify(this._films, null);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(update) {
    console.log('updateFilm:', update);
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    console.log('updateFilm:', this._films);
    this._notify(this._films, update);
  }
}