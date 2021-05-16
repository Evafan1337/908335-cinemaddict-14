import Observer from "./observer";

// Смотреть на именование
export default class Filter extends Observer {
  constructor() {
    super();
    this._filterFilmsCount = null;
    this._sortBy = null;
    this._filterBy = null;
  }

  /**
   * Установить значение сортировки и фильтрации
   * @param {String} - sortBy - значение сортировки
   * @param {String} - filterBy - значение фильтрации
   * @param {Object} - stats - объект статистики
   */
  setSortType(sortBy, filterBy, stats) {

    console.log('setSortType');
    console.log(sortBy);
    console.log(filterBy);

    this._sortBy = sortBy;
    this._filterBy = filterBy;
    this._stats = stats;

    this._notifyChanges();
  }

  /**
   * Получить "значение" сортировки
   * @return {string} - значение сортировки
   */
  getSortType() {
    return this._sortBy;
  }

  getFilterType() {
    return this._filterBy;
  }

  /**
   * Установить значение отсортированных фильмов
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
    // console.log(this);
    return this._filterFilmsCount;
  }

  _notifyChanges() {
    console.log('_notifyChanges');
    this._notify({filterBy: this._filterBy, sortBy: this._sortBy, filterFilmsCount: this._filterFilmsCount});
  }

}