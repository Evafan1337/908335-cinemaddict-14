import Observer from './observer';

/**
 * Класс описывает модель фильмов
 * @extends Observer
 */
export default class Films extends Observer {

  /**
   * Конструктор
   * Выполняется конструктор родительского класса
   * Объявляется массив данных о фильмах
   * @constructor
   */
  constructor() {
    super();
    this._films = [];
  }

  /**
   * Сеттер, "устанавливает" значения фильмов
   * Запускает метод "уведомления"
   * @param {Array} - films данные о фильмах
   */
  setFilms(films) {
    this._films = films.slice();
    this._notify(this._films, null);
  }

  /**
   * Геттер, возвращает значения фильмов
   * @return {Array} - this._films данные о фильмах
   */
  getFilms() {
    return this._films;
  }

  /**
   * Метод обновления фильма и "уведомления" подписчиков
   * Для дальнейшей обработки
   * @param {Object} update - данные фильма, которые надо обновить
   */
  updateFilm(update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can not update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(this._films, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        actors: film.film_info.actors,
        age: film.film_info.age_rating,
        info: {
          originTitle: film.film_info.alternative_title,
          poster: film.film_info.poster,
          title: film.film_info.title,
        },
        description: film.film_info.description,
        regisseur: film.film_info.director,
        genre: film.film_info.genre,
        date: film.film_info.release.date,
        country: film.film_info.release.release_country,
        time: film.film_info.runtime,
        rating: film.film_info.total_rating,
        screenwriters: film.film_info.writers,
        isWatchlist: film.user_details.watchlist,
        isViewed: film.user_details.already_watched,
        isFavorite: film.user_details.favorite,
        watchedData: film.user_details.watching_date,
      },
    );

    const filmFieldsToDelete = ['film_info', 'user_details'];

    for (const field of filmFieldsToDelete) {
      delete adaptedFilm[field];
    }

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'film_info': {
          'actors': film.actors,
          'age_rating': film.age,
          'alternative_title': film.info.originTitle,
          'description': film.description,
          'director': film.regisseur,
          'genre': film.genre,
          'poster': film.info.poster,
          'release': {
            'date': film.date,
            'release_country': film.country,
          },
          'runtime': film.time,
          'title': film.info.title,
          'total_rating': film.rating,
          'writers': film.screenwriters,
        },
        'user_details': {
          'watchlist': film.isWatchlist,
          'already_watched': film.isViewed,
          'favorite': film.isFavorite,
          'watching_date': film.watchedData,
        },
      },
    );

    fieldsToDelete = ['actors', 'age', 'info', 'description', 'regisseur', 'genre', 'date', 'country', 'time', 'rating', 'screenwriters', 'isWatchlist', 'isViewed', 'isFavorite', 'watchedData'];

    for (const field of fieldsToDelete) {
      delete adaptedFilm[field];
    }

    return adaptedFilm;
  }
}
