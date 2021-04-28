import SortPanelView from '../view/sort-panel';
import {render, RenderPosition} from '../utils';

export default class SortPresenter {
  constructor(sortContainer) {
    this._sortContainer = sortContainer;
    this._sortPanel = null;
    this._handleSortItemClick = this._handleSortItemClick.bind(this);
  }

  init() {
    this._sortPanel = new SortPanelView();
    this._renderSort();
  }

  _renderSort() {
    render(this._sortContainer, this._sortPanel);
    this._sortPanel.setClickHandler((evt) => this._handleSortItemClick(evt));
  }

  _handleSortItemClick(evt) {
    this._sortPanel.getActiveMenuLink().classList.remove('sort__button--active');
    evt.target.classList.add('sort__button--active');
    const param = evt.target.getAttribute('data-sort');
  }
}
