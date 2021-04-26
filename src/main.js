import MenuView from './view/menu';
import FilmListView from './view/films-list';
import CountFilmsView from './view/count-films';
import FilmCardView from './view/film-card';
import LoadmoreView from './view/loadmore';
import PopupView from './view/popup';
import EmptyFilmsView from './view/empty-films';
import SortPanelView from './view/sort-panel';
import CommentsView from './view/comments';
import {
  render,
  RenderPosition,
  compareValues,
  filmsInfoSort,
  sortFilmsRated,
  sortFilmsCommented
} from './utils';
import {generateFilms} from './mock/film';

const FILM_COUNT = 48;
const FILM_PER_PAGE = 5;
const FILM_RATED_COUNT = 2;

let isOpenedPopup = false;

/**
 * Функция установки слушателя на определенную карточку фильма
 * @param {Object} evt - объект событий
 */
const setOpenPopupHandler = (evt, filmCardData) => {

  console.log('setOpenPopupHandler');
  if(isOpenedPopup) {
    console.log('alreadyOpened!');
    return;
  }

  const target = evt.target;
  if (target.classList.contains('js-open-popup')) {

    /**
     * Функция показа полной карточки фильма
     * @param {string} id - id фильма
     */
    const showPopup = () => {
      const film = filmCardData;
      const filmPopupComponent = new PopupView(film);
      render(siteBody, filmPopupComponent);
      isOpenedPopup = true;
      siteBody.classList.add('hide-overflow');

      const commentsComponent = new CommentsView(film.comments);
      const commentsContainer = filmPopupComponent.getElement().querySelector('.film-details__bottom-container');
      render(commentsContainer, commentsComponent);

      //  Навешивание обработчиков
      // const popupElem = filmPopupComponent.getElement();
      filmPopupComponent.setClickHandler(() => closePopup(filmPopupComponent));
      document.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          filmPopupComponent.getElement().removeEventListener('keydown', () => closePopup(filmPopupComponent));
          closePopup(filmPopupComponent);
        }
      });
    };
    showPopup();
  }
};

const films = generateFilms(FILM_COUNT);

let filteredFilms = [...films].sort(compareValues('id'));
const siteBody = document.querySelector('body');
const siteMainElement = document.querySelector('.main');
const siteCountFilmsElement = document.querySelector('.footer__statistics');
const menuComponent = new MenuView(filmsInfoSort(filteredFilms));
const sortComponent = new SortPanelView();
render(siteMainElement, menuComponent);
render(siteMainElement, sortComponent);
render(siteMainElement, new FilmListView());
render(siteCountFilmsElement, new CountFilmsView(FILM_COUNT));

const filmList = siteMainElement.querySelector('.js-film-list-main');
const filmListRated = siteMainElement.querySelector('.js-film-list-rated');
const filmListCommented = siteMainElement.querySelector('.js-film-list-commented');
const filmsContainer = siteMainElement.querySelector('.js-films-container');

if (filteredFilms.length > 0) {
  // Либо рендерим 5 за раз либо оставшиеся
  for (let i = 0; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
    const filmCardElement = new FilmCardView(filteredFilms[i]);
    const filmCardData = filteredFilms[i];
    render(filmList, filmCardElement);

    filmCardElement.setClickHandler((evt) => {
      setOpenPopupHandler(evt, filmCardData);
    });
  }
} else {
  render(filmList, new EmptyFilmsView());
}

if (filteredFilms.length > FILM_PER_PAGE) {
  let renderedFilmsCount = FILM_PER_PAGE;
  const loadMoreComponent = new LoadmoreView();
  render(filmsContainer, loadMoreComponent);


  loadMoreComponent.setClickHandler(() => {

    const renderMoreFilms = (film, index) => {
      const filmCardElement = new FilmCardView(film);
      const filmCardData = filteredFilms[index];
      render(filmList, filmCardElement);

      // filmCardElement.addEventListener('click', (evt) => {
      filmCardElement.setClickHandler((evt) =>{
        setOpenPopupHandler(evt, filmCardData);
      });
    };

    // Отрисовка оставшихся
    filteredFilms
      .slice(renderedFilmsCount, renderedFilmsCount + FILM_PER_PAGE)
      .forEach((film, index) => renderMoreFilms(film, index));

    renderedFilmsCount += FILM_PER_PAGE;

    if (renderedFilmsCount >= filteredFilms.length) {
      loadMoreComponent.getElement().style.display = 'none';
      renderedFilmsCount = FILM_PER_PAGE;
    }

  });

  // Делегирование
  // const filterButtonsContainer = siteMainElement.querySelector('.main-navigation__items');
  menuComponent.setClickHandler((evt) => {
    if(evt.target.tagName !== 'A'){
      return;
    }

    const filterButtonElement = evt.target;
    const filterParam = filterButtonElement.dataset.sort;

    menuComponent.getElement().querySelector('.main-navigation__item--active').classList.remove('main-navigation__item--active');
    filterButtonElement.classList.add('main-navigation__item--active');
    filteredFilms = films.slice();
    if (filteredFilms.length > FILM_PER_PAGE) {
      loadMoreComponent.getElement().style.display = 'block';
    }
    if (filterParam !== 'all') {
      filteredFilms = filteredFilms.filter((film) => film[filterParam] === true);
    }
    filmList.innerHTML = '';

    for (let i = 0; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
      const filmCardElement = new FilmCardView(filteredFilms[i]);
      const filmCardData = filteredFilms[i];
      render(filmList, filmCardElement);
      filmCardElement.setClickHandler((evt) =>{
        setOpenPopupHandler(evt, filmCardData);
      });
    }
  });

  // Делегирование
  sortComponent.setClickHandler((evt) => {
    if(evt.target.tagName !== 'A'){
      return;
    }

    const sortButtonElement = evt.target;
    const sortParam = sortButtonElement.dataset.sort;

    sortComponent.getElement().querySelector('.sort__button--active').classList.remove('sort__button--active');
    sortButtonElement.classList.add('sort__button--active');

    if (filteredFilms.length > FILM_PER_PAGE) {
      loadMoreComponent.getElement().style.display = 'block';
    }

    filteredFilms = films;
    if (sortParam !== 'default') {
      filteredFilms = filteredFilms.sort(compareValues(sortParam, 'desc'));
    } else {
      filteredFilms = filteredFilms.sort(compareValues('id', 'asc'));
    }

    filmList.innerHTML = '';

    for (let i = 0; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
      const filmCardElement = new FilmCardView(filteredFilms[i]);
      const filmCardData = filteredFilms[i];
      render(filmList, filmCardElement);
      filmCardElement.setClickHandler((evt) =>{
        setOpenPopupHandler(evt, filmCardData);
      });
    }
  });
}

for (let i = 0; i < FILM_RATED_COUNT; i++) {
  const sortFilmsRatedData = sortFilmsRated(filteredFilms);
  // const filmCardElement = new FilmCardView(sortFilmsRated(filteredFilms)[i]);
  const filmCardElement = new FilmCardView(sortFilmsRatedData[i]);
  const filmCardData = sortFilmsRatedData[i];
  render(filmListRated, filmCardElement);
  filmCardElement.setClickHandler((evt) =>{
    setOpenPopupHandler(evt, filmCardData);
  });
}

for (let i = 0; i < FILM_RATED_COUNT; i++) {
  const sortFilmsCommentedData = sortFilmsCommented(filteredFilms);
  // const filmCardElement = new FilmCardView(sortFilmsCommented(filteredFilms)[i]);
  const filmCardElement = new FilmCardView(sortFilmsCommentedData[i]);
  const filmCardData = sortFilmsCommentedData[i];
  render(filmListCommented, filmCardElement);
  filmCardElement.setClickHandler((evt) =>{
    setOpenPopupHandler(evt, filmCardData);
  });
}

/**
 * Функция скрытия попапа
 * @param {string} id - id фильма
 */
const closePopup = (filmPopupComponent) => {
  isOpenedPopup = false;
  filmPopupComponent.getElement().remove();
  filmPopupComponent.removeElement();
  siteBody.classList.remove('hide-overflow');
};
