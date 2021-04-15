import {createElement} from "../utils";

/**
 * Функция создания счетчика фильмов
 * @param {number} count - счетчик фильмов
 * @return {string}
 */
const createFooterStatisticsTemplate = (count) => {
  return `<p>${count} movies inside</p>`;
};

export default class FooterStatistics {
  constructor(count) {
    this._element = null;
    this._filmCount = count;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._filmCount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}