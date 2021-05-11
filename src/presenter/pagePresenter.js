import RatedFilmsPresenter from './ratedFilms';
import CommentedFilmsPresenter from './commentedFilms';
import FilmsPresenter from './films';
import EmptyPresenter from './empty';
import {
  render,
  RenderPosition}
from '../utils/render';
import FooterStatisticsView from '../view/count-films';

export default class PagePresenter { 
  constructor (siteBody, siteMainElement, siteFooterStatistics, films) {
    this._siteBody = siteBody;
    this._siteMailElement = siteMainElement;
    this._siteFooterStatistics = siteFooterStatistics;
    this._films = films;
    this._filmsCount = films.length;
  }

  init () {
  	this._initFilmsPresenter()
  	this._initSubFilmsPresenters();
  	this._renderFooterComponent();
  }

  _initFilmsPresenter () {
  	if(this._filmsCount == 0) {
  		this._initEmptyPresenter()
  	}
  	const filmsPresenter = new FilmsPresenter(this._siteMailElement);
  	filmsPresenter.init(this._films)
  }

  _initSubFilmsPresenters () {
  	if(this._filmsCount == 0) {
  		return;
  	}

  	const ratedFilmsPresenter = new RatedFilmsPresenter(this._siteMailElement);
  	const commentedFilmsPresenter = new CommentedFilmsPresenter(this._siteMailElement);

  	ratedFilmsPresenter.init(this._films)
  	commentedFilmsPresenter.init(this._films)
  }

  _initEmptyPresenter () {
  	const emptyPresenter = new EmptyPresenter(this._siteMailElement);
  	emptyPresenter.init();
  }

  _renderFooterComponent () {
  	render(this._siteFooterStatistics, new FooterStatisticsView(this._filmsCount));
  }

}
