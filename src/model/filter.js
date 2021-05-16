import Observer from "./observer";


/**
 * Класс описывает модель фильмов
 * @extends Observer
 */
export default class Filter extends Observer {

  /**
   * Конструктор
   * Объявляются служебные поля
   * Параметры фильтрации и сортировки
   * @constructor
   */
  constructor() {
    super();
    this._filterFilmsCount = null;
    this._sortBy = null;
    this._filterBy = null;
    this._showStatsFlag = null;
  }

  /**
   * Установить значение сортировки и фильтрации
   * @param {String} - sortBy - значение сортировки
   * @param {String} - filterBy - значение фильтрации
   * @param {Object} - showStatsFlag - объект статистики
   */
  setSortType(sortBy, filterBy, showStatsFlag) {
    this._sortBy = sortBy;
    this._filterBy = filterBy;
    this._showStatsFlag = showStatsFlag;

    this._notifyChanges();
  }

  /**
   * Получить "значение" сортировки
   * @return {string} - значение сортировки
   */
  getSortType() {
    return this._sortBy;
  }

  /**
   * Получить "значение" фильтрации
   * @return {string} - значение фильтрации
   */
  getFilterType() {
    return this._filterBy;
  }

  /**
   * Получить "значение" флага статистики (True/False)
   * @return {string} - значение флага
   */
  getStats() {
    return this._showStatsFlag;
  }

  /**
   * Установить значение отсортированных фильмов
   * Уведомить подписчиков
   * @param {Object} - filterFilmsCount - объект значений сортировки
   */
  setSort(filterFilmsCount) {
    this._filterFilmsCount = filterFilmsCount;
    this._notifyChanges();
  }

  /**
   * Получить "значение" сортировки ( количество фильмов )
   */
  getSort() {
    return this._filterFilmsCount;
  }

  /**
   * Обертка над методом уведомления подписчиков класса родителя (Observer)
   */
  _notifyChanges() {
    this._notify({filterBy: this._filterBy, sortBy: this._sortBy, filterFilmsCount: this._filterFilmsCount});
  }

}