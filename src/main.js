import MenuView from './view/menu';
import FilmListView from './view/films-list';
import CountFilmsView from './view/count-films';
import FilmCardView from './view/film-card';
import LoadmoreView from './view/loadmore';
import PopupView from './view/popup';
import EmptyFilmsView from './view/empty-films';
import SortPanelView from './view/sort-panel';
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

//	Создаются массивы длинной FILM_COUNT
const films = generateFilms(FILM_COUNT);

let filteredFilms = [...films].sort(compareValues('id'));

const siteBody = document.querySelector('body');
const siteMainElement = document.querySelector('.main');
const siteCountFilmsElement = document.querySelector('.footer__statistics');

render(siteMainElement, new MenuView(filmsInfoSort(filteredFilms)).getElement());
render(siteMainElement, new SortPanelView().getElement());
render(siteMainElement, new FilmListView().getElement());
render(siteCountFilmsElement, new CountFilmsView(FILM_COUNT).getElement());

const filmList = siteMainElement.querySelector('.js-film-list-main');
const filmListRated = siteMainElement.querySelector('.js-film-list-rated');
const filmListCommented = siteMainElement.querySelector('.js-film-list-commented');
const filmsContainer = siteMainElement.querySelector('.js-films-container');

if (filteredFilms.length > 0) {
  // Либо рендерим 5 за раз либо оставшиеся
  for (let i = 0; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
    render(filmList, new FilmCardView(filteredFilms[i]).getElement());
  }
} else {
  render(filmList, new EmptyFilmsView().getElement());
}

if (filteredFilms.length > FILM_PER_PAGE) {
  let renderedFilmsCount = FILM_PER_PAGE;
  render(filmsContainer, new LoadmoreView().getElement());
  const loadMoreButton = filmsContainer.querySelector('.js-loadmore');

  loadMoreButton.addEventListener('click', () => {

    // Отрисовка оставшихся
    filteredFilms
      .slice(renderedFilmsCount, renderedFilmsCount + FILM_PER_PAGE)
      .forEach((film) => render(filmList, new FilmCardView(film).getElement()));

    renderedFilmsCount += FILM_PER_PAGE;

    if (renderedFilmsCount >= filteredFilms.length) {
      loadMoreButton.style.display = 'none';
      renderedFilmsCount = FILM_PER_PAGE;
    }

  });

  // Делегирование
  const filterButtonsContainer = siteMainElement.querySelector('.main-navigation__items');
  filterButtonsContainer.addEventListener('click', (evt) => {

    if(evt.target.tagName !== 'A'){
      return;
    }

    const filterButtonElement = evt.target;
    const filterParam = filterButtonElement.dataset.sort;

    filterButtonsContainer.querySelector('.main-navigation__item--active').classList.remove('main-navigation__item--active');
    filterButtonElement.classList.add('main-navigation__item--active');
    filteredFilms = films.slice();
    if (filteredFilms.length > FILM_PER_PAGE) {
      loadMoreButton.style.display = 'block';
    }
    if (filterParam !== 'all') {
      filteredFilms = filteredFilms.filter((film) => film[filterParam] === true);
    }
    filmList.innerHTML = '';

    for (let i = 0; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
      render(filmList, new FilmCardView(filteredFilms[i]).getElement(), 'beforeend');
    }
  });

  // Делегирование
  const sortedButtonsContainer = siteMainElement.querySelector('.sort');
  sortedButtonsContainer.addEventListener('click', (evt) => {
    if(evt.target.tagName !== 'A'){
      return;
    }

    const sortButtonElement = evt.target;
    const sortParam = sortButtonElement.dataset.sort;

    sortedButtonsContainer.querySelector('.sort__button--active').classList.remove('sort__button--active');
    sortButtonElement.classList.add('sort__button--active');

    filteredFilms = films;
    if (sortParam !== 'default') {
      filteredFilms = filteredFilms.sort(compareValues(sortParam, 'desc'));
    } else {
      filteredFilms = filteredFilms.sort(compareValues('id', 'asc'));
    }

    filmList.innerHTML = '';

    for (let i = 0; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
      render(filmList, new FilmCardView(filteredFilms[i]).getElement());
    }
  });
}

for (let i = 0; i < FILM_RATED_COUNT; i++) {
  render(filmListRated, new FilmCardView(sortFilmsRated(filteredFilms)[i]).getElement());
}

for (let i = 0; i < FILM_RATED_COUNT; i++) {
  render(filmListCommented, new FilmCardView(sortFilmsCommented(filteredFilms)[i]).getElement());
}

//  Следующий этап это вешать обработчики не на siteBody, а точечно на карточку
siteBody.addEventListener('click', (evt) => {
  const target = evt.target;
  if (target.classList.contains('js-open-popup')) {

    const filmId = target.closest('.film-card').dataset.id;

    /**
    * Функция показа полной карточки фильма
    * @param {string} id - id фильма
    */
    const showPopup = () => {
      const film = films.filter((film) => film.id === filmId)[0];
      const filmPopupComponent = new PopupView(film);
      render(siteBody, filmPopupComponent.getElement(), RenderPosition.BEFOREEND);
      siteBody.classList.add('hide-overflow');

      //Навешивание обработчиков
      const popupElem = filmPopupComponent.getElement();
      popupElem.querySelector('.film-details__close-btn').addEventListener('click', () => closePopup(filmPopupComponent));
      document.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          filmPopupComponent.getElement().removeEventListener('keydown', () => closePopup(filmPopupComponent));
          closePopup(filmPopupComponent);
        }
      });
    };

    showPopup();
  }
});


/**
 * Функция скрытия попапа
 * @param {string} id - id фильма
 */
const closePopup = (filmPopupComponent) => {
  filmPopupComponent.getElement().remove();
  filmPopupComponent.removeElement();
  siteBody.classList.remove('hide-overflow');
};
