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
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(this._films, update);
  }
}
