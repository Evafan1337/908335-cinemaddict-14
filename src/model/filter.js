import Observer from './observer';

/**
 * Класс описывает модель фильтрации
 * Описаны методы для работы с отображением фильмов (выборка и сортировка)
 * @extends Observer
 */
export default class Filter extends Observer {

  /**
   * Конструктор
   * Объявляются служебные поля
   * Параметры фильтрации и сортировки
   * @param {Object} api - интерфейс для общения с сервером
   * @constructor
   */
  constructor(api) {
    super();
    this._filterFilmsCount = null;
    this._sortBy = null;
    this._filterBy = null;
    this._showStatsFlag = null;
    this._api = api;
  }

  /**
   * Установить значение сортировки и фильтрации
   * @param {String} - sortBy - значение сортировки
   * @param {String} - filterBy - значение фильтрации
   * @param {Object} - showStatsFlag - объект статистики
   */
  setSortType(sortBy, filterBy, showStatsFlag, UpdateType) {
    this._sortBy = sortBy;
    this._filterBy = filterBy;
    this._showStatsFlag = showStatsFlag;

    this._notifyChanges(UpdateType);
  }

  /**
   * Получить "значение" сортировки
   * @return {string} - значение сортировки
   */
  getSortBy() {
    return this._sortBy;
  }

  /**
   * Получить "значение" фильтрации
   * @return {string} - значение фильтрации
   */
  getFilterBy() {
    return this._filterBy;
  }

  /**
   * Получить "значение" флага статистики (True/False)
   * @return {string} - значение флага
   */
  getShowStatsFlag() {
    return this._showStatsFlag;
  }

  /**
   * Установить значение отсортированных фильмов
   * Уведомить подписчиков
   * @param {Object} - filterFilmsCount - объект значений сортировки
   */
  // setFilterFilmsCount(filterFilmsCount, UpdateType) {
  setFilterFilmsCount(filterFilmsCount) {
    this._filterFilmsCount = filterFilmsCount;
    // this._notifyChanges(UpdateType);
  }

  /**
   * Получить "значение" сортировки ( количество фильмов )
   */
  getFilterFilmsCount() {
    return this._filterFilmsCount;
  }

  /**
   * Обертка над методом уведомления подписчиков класса родителя (Observer)
   */
  _notifyChanges(UpdateType) {
    this._notify(UpdateType, {filterBy: this._filterBy, sortBy: this._sortBy, filterFilmsCount: this._filterFilmsCount});
  }
}
