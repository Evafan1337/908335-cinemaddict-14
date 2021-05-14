import Observer from './observer';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  updateFilm(update) {
    const index = this._films.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];
  }

  addFilm(update) {
    this._films = [
      update,
      ...this._films
    ];
  }

  deleteFilm(update) {
    const index = this._films.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    this._films = [
      ...this._films.slice(0, index),
      ...this._films.slice(index + 1)
    ];
  }
}