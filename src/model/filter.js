import Observer from "./observer";

// Смотреть на именование
export default class Filter extends Observer {
  constructor() {
    console.log('Filter constructor');
    super();
    this._filterFilmsCount = null;
    this._sortType = {};
  }

  setSortType(sort, filter) {
    console.log('setSortType');
    console.log(sort);
    console.log(filter);
    this._sortType = {
      sort,
      filter
    };
    this._notifyChanges();
  }

  getSortType() {
    return this._sortType;
  }

  setSort(filterFilmsCount) {
    console.log('setSort');
    console.log(filterFilmsCount);
    this._filterFilmsCount = filterFilmsCount;
    //
    this._notify({sortType: this._sortType, sort: this._filterFilmsCount});
    this._notifyChanges();
  }

  getSort() {
    console.log('getSort');
    return this._filterFilmsCount;
  }

  _notifyChanges() {
    this._notify({sortType: this._sortType, sort: this._sort});
    this._notify({sortType: this._sortType, sort: this._sort});
  }

}