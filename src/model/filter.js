import Observer from "./observer";

// Смотреть на именование
export default class Filter extends Observer {
  constructor() {
    console.log('Filter constructor');
    super();
    this._filterFilmsCount = null;
    this._sortBy = null;
    this._filterBy = null;
  }

  //  Переработать аргументацию
  setSortType(sortBy, filterBy, stats) {
    console.log('setSortType');
    console.log(sortBy);
    console.log(filterBy);
    console.log(stats);

    this._sortBy = sortBy;
    this._filterBy = filterBy;
    this._stats = stats;

    this._notifyChanges();
  }

  getSortType() {
    return this._sortBy;
  }

  setSort(filterFilmsCount) {
    console.log('setSort');
    console.log(filterFilmsCount);
    this._filterFilmsCount = filterFilmsCount;
    //
    this._notify({sortBy: this._sortBy, sort: this._filterFilmsCount});
    this._notifyChanges();
  }

  getSort() {
    console.log('getSort');
    return this._filterFilmsCount;
  }

  _notifyChanges() {
    this._notify({sortBy: this._sortBy, sort: this._sort});
    this._notify({sortBy: this._sortBy, sort: this._sort});
  }

}