import FooterStatisticsView from '../view/count-films';
import {render, RenderPosition} from '../utils';

export default class FooterPresenter {
  constructor(footerContainer) {
    this._footerContainer = footerContainer;
    this._filmsCount = null;
  }

  init(count) {
    this._filmsCount = count;
    this._renderFooter();
  }

  _renderFooter() {
    render(this._footerContainer, new FooterStatisticsView(this._filmsCount));
  }
}