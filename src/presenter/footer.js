import FooterStatisticsView from '../view/count-films';
import {render} from '../utils/render';

export default class FooterPresenter {
  constructor(footerContainer) {
    this._footerContainer = footerContainer;
    this._filmsCount = null;
  }

  /**
   * Публичный метод инициализации
   * @param {number} count - количество фильмов
   */
  init(count) {
    this._filmsCount = count;
    this._renderFooter();
  }

  /**
   * Приватный метод рендера нижней статистики фильмов
   */
  _renderFooter() {
    render(this._footerContainer, new FooterStatisticsView(this._filmsCount));
  }
}
