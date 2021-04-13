import {createCardFilmTemplate} from './view/film-card';
import {createFooterStatisticsTemplate} from './view/count-films';
import {createMenuTemplate} from './view/menu';
import {createSortPanelTemplate} from './view/sort-panel';
import {createFilmListTemplate} from './view/films-list';
import {generateFilm} from './mock/film';
import {createLoadmoreTemplate} from './view/loadmore';
import {createTemplatePopupFilm} from './view/popup';
import {createEmptyFilms} from './view/empty-films';
import {render} from './utils';
import {compareValues} from './utils';

const FILM_COUNT = 48;
const FILM_PER_PAGE = 5;
const FILM_RATED_COUNT = 2;

//	Создаются массивы длинной FILM_COUNT
const films = new Array(FILM_COUNT).fill().map(generateFilm);

let filteredFilms = films.sort(compareValues(`id`));

/**
 * Функция сортировки фильмов по рейтингу
 * @param {Array} filmsArray - массив фильмов
 * @return {Array} filmsArray - массив фильмов
 */
const filmsRated = (filmsArray) => {
  return filmsArray.sort(compareValues(`rating`, `desc`)).slice(0, FILM_RATED_COUNT);
};

/**
 * Функция сортировки фильмов по количеству комментариев
 * @param {Array} filmsArray - массив фильмов
 * @return {Array} - отсортированный массив
 */
const filmsCommented = (filmsArray) => {
  return filmsArray.sort(compareValues(`comments`, `desc`)).slice(0, FILM_RATED_COUNT);
};

/**
 * Функция фильтрации фильмов (по наличию чекбоксов)
 * @param {Array} filmsArray - массив фильмов
 * @return {Object} filmsInfo
 */
const filmsInfoSort = (filmsArray) => {
  const filmsInfo = {
    watchlist: filmsArray.filter((item) => item.isWatchlist === true),
    history: filmsArray.filter((item) => item.isViewed === true),
    favorites: filmsArray.filter((item) => item.isFavorite === true),
  };

  return filmsInfo;
};

const siteBody = document.querySelector(`body`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterStatistics = document.querySelector(`.footer__statistics`);

render(siteMainElement, createMenuTemplate(filmsInfoSort(filteredFilms)), `beforeend`);
render(siteMainElement, createSortPanelTemplate(), `beforeend`);
render(siteMainElement, createFilmListTemplate(), `beforeend`);
render(siteFooterStatistics, createFooterStatisticsTemplate(FILM_COUNT), `beforeend`);

const filmList = siteMainElement.querySelector(`.js-film-list-main`);
const filmListRated = siteMainElement.querySelector(`.js-film-list-rated`);
const filmListCommented = siteMainElement.querySelector(`.js-film-list-commented`);
const filmsContainer = siteMainElement.querySelector(`.js-films-container`);

if (filteredFilms.length > 0) {
  render(filmList, createCardFilmTemplate(filteredFilms[0]), `beforeend`);

  // Либо рендерим 5 за раз либо оставшиеся
  for (let i = 1; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
    render(filmList, createCardFilmTemplate(filteredFilms[i]), `beforeend`);
  }
} else {
  render(filmList, createEmptyFilms(), `beforeend`);
}

if (filteredFilms.length > FILM_PER_PAGE) {
  let renderedFilmsCount = FILM_PER_PAGE;
  render(filmsContainer, createLoadmoreTemplate(), `beforeend`);
  const loadMoreButton = filmsContainer.querySelector(`.js-loadmore`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    // Отрисовка оставшихся
    filteredFilms
      .slice(renderedFilmsCount, renderedFilmsCount + FILM_PER_PAGE)
      .forEach((film) => render(filmList, createCardFilmTemplate(film), `beforeend`));

    renderedFilmsCount += FILM_PER_PAGE;

    if (renderedFilmsCount >= filteredFilms.length) {
      loadMoreButton.style.display = `none`;
      renderedFilmsCount = FILM_PER_PAGE;
    }

  });

  const filterBtns = siteMainElement.querySelectorAll(`.main-navigation__item`);
  //  Отработка фильтрации
  for (let btn of filterBtns) {
    btn.addEventListener(`click`, function (evt) {
      evt.preventDefault();

      renderedFilmsCount = FILM_PER_PAGE;
      // let id = this.getAttribute(`id`);
      let param = btn.getAttribute(`data-sort`);
      document.querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
      btn.classList.add(`main-navigation__item--active`);
      filteredFilms = films.slice();
      if (filteredFilms.length > FILM_PER_PAGE) {
        loadMoreButton.style.display = `block`;
      }
      if (param !== `all`) {
        filteredFilms = filteredFilms.filter((film) => film[param] === true);
      }
      filmList.innerHTML = ``;

      render(filmList, createCardFilmTemplate(filteredFilms[0]), `beforeend`);

      for (let i = 1; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
        render(filmList, createCardFilmTemplate(filteredFilms[i]), `beforeend`);
      }
    });
  }

  const sortedBtns = siteMainElement.querySelectorAll(`.sort__button`);
  // Отработка сортировки
  for (let btn of sortedBtns) {
    btn.addEventListener(`click`, function (evt) {
      evt.preventDefault();

      document.querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
      btn.classList.add(`sort__button--active`);
      let param = btn.getAttribute(`data-sort`);

      filteredFilms = films;
      if (param !== `default`) {
        filteredFilms = filteredFilms.sort(compareValues(param, `desc`));
      } else {
        filteredFilms = filteredFilms.sort(compareValues(`id`, `asc`));
      }

      filmList.innerHTML = ``;

      render(filmList, createCardFilmTemplate(filteredFilms[0]), `beforeend`);

      for (let i = 1; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
        render(filmList, createCardFilmTemplate(filteredFilms[i]), `beforeend`);
      }
    });
  }
}


for (let i = 0; i < FILM_RATED_COUNT; i++) {
  render(filmListRated, createCardFilmTemplate(filmsRated(filteredFilms)[i]), `beforeend`);
}

for (let i = 0; i < FILM_RATED_COUNT; i++) {
  render(filmListCommented, createCardFilmTemplate(filmsCommented(filteredFilms)[i]), `beforeend`);
}

// const filmCards = document.querySelectorAll(`.film-card`);

siteBody.addEventListener(`click`, function (event) {
  let target = event.target;
  if (target.classList.contains(`js-open-popup`) === true) {
    showpopup(target.closest(`.film-card`).getAttribute(`id`));
  }
});

/**
 * Функция показа полной карточки фильма
 * @param {string} id - id фильма
 */
const showpopup = (id) => {
  let film = films.filter((item) => item.id === id)[0];
  render(siteBody, createTemplatePopupFilm(film), `beforeend`);
};

siteBody.addEventListener(`click`, (event) => {
  let target = event.target;
  if (target.classList.contains(`film-details__close-btn`) === true) {
    document.querySelector(`.film-details`).remove();
  }
});
