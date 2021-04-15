import {createCardFilmTemplate} from './view/film-card';
import {createFooterStatisticsTemplate} from './view/count-films';
// import {createMenuTemplate} from './view/menu';
// import {createSortPanelTemplate} from './view/sort-panel';
import SortPanel from "./view/sort-panel";
import {createFilmListTemplate} from './view/films-list';
import {generateFilm} from './mock/film';
import {createLoadmoreTemplate} from './view/loadmore';
import {createTemplatePopupFilm} from './view/popup';
import {createEmptyFilms} from './view/empty-films';
import {render} from './utils';
import {renderTemplate} from './utils';
import {RenderPosition} from './utils';
import {compareValues} from './utils';
import {filmsInfoSort} from './utils';
import {sortFilmsRated} from './utils';
import {sortFilmsCommented} from './utils';
import Menu from './view/menu';


const FILM_COUNT = 48;
const FILM_PER_PAGE = 5;
const FILM_RATED_COUNT = 2;

//	Создаются массивы длинной FILM_COUNT
const films = new Array(FILM_COUNT).fill().map(generateFilm);

let filteredFilms = films.sort(compareValues('id'));

const siteBody = document.querySelector('body');
const siteMainElement = document.querySelector('.main');
const siteFooterStatistics = document.querySelector('.footer__statistics');

// render(siteMainElement, createMenuTemplate(filmsInfoSort(filteredFilms)));
//  new
render(siteMainElement, new Menu(filmsInfoSort(filteredFilms)).getElement(), `beforeend`);

render(siteMainElement, new SortPanel().getElement(), `beforeend`);
renderTemplate(siteMainElement, createFilmListTemplate(), 'beforeend');
renderTemplate(siteFooterStatistics, createFooterStatisticsTemplate(FILM_COUNT));

const filmList = siteMainElement.querySelector('.js-film-list-main');
const filmListRated = siteMainElement.querySelector('.js-film-list-rated');
const filmListCommented = siteMainElement.querySelector('.js-film-list-commented');
const filmsContainer = siteMainElement.querySelector('.js-films-container');

if (filteredFilms.length > 0) {

  // Либо рендерим 5 за раз либо оставшиеся
  for (let i = 0; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
    renderTemplate(filmList, createCardFilmTemplate(filteredFilms[i]));
  }
} else {
  renderTemplate(filmList, createEmptyFilms(), 'beforeend');
}

if (filteredFilms.length > FILM_PER_PAGE) {
  let renderedFilmsCount = FILM_PER_PAGE;
  renderTemplate(filmsContainer, createLoadmoreTemplate());
  const loadMoreButton = filmsContainer.querySelector('.js-loadmore');

  loadMoreButton.addEventListener('click', (evt) => {

    // Отрисовка оставшихся
    filteredFilms
      .slice(renderedFilmsCount, renderedFilmsCount + FILM_PER_PAGE)
      .forEach((film) => renderTemplate(filmList, createCardFilmTemplate(film)));

    renderedFilmsCount += FILM_PER_PAGE;

    if (renderedFilmsCount >= filteredFilms.length) {
      loadMoreButton.style.display = 'none';
      renderedFilmsCount = FILM_PER_PAGE;
    }

  });

  const filterBtns = siteMainElement.querySelectorAll('.main-navigation__item');
  //  Отработка фильтрации
  for (const btn of filterBtns) {
    btn.addEventListener('click', (evt) => {

      renderedFilmsCount = FILM_PER_PAGE;
      // let id = this.getAttribute(`id`);
      const param = btn.getAttribute('data-sort');
      document.querySelector('.main-navigation__item--active').classList.remove('main-navigation__item--active');
      btn.classList.add('main-navigation__item--active');
      filteredFilms = films.slice();
      if (filteredFilms.length > FILM_PER_PAGE) {
        loadMoreButton.style.display = 'block';
      }
      if (param !== 'all') {
        filteredFilms = filteredFilms.filter((film) => film[param] === true);
      }
      filmList.innerHTML = '';

      for (let i = 0; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
        renderTemplate(filmList, createCardFilmTemplate(filteredFilms[i]));
      }
    });
  }

  const sortedBtns = siteMainElement.querySelectorAll('.sort__button');
  // Отработка сортировки
  for (const btn of sortedBtns) {
    btn.addEventListener('click', (evt) => {

      document.querySelector('.sort__button--active').classList.remove('sort__button--active');
      btn.classList.add('sort__button--active');
      const param = btn.getAttribute('data-sort');

      filteredFilms = films;
      if (param !== 'default') {
        filteredFilms = filteredFilms.sort(compareValues(param, 'desc'));
      } else {
        filteredFilms = filteredFilms.sort(compareValues('id', 'asc'));
      }

      filmList.innerHTML = '';

      for (let i = 0; i < Math.min(filteredFilms.length, FILM_PER_PAGE); i++) {
        renderTemplate(filmList, createCardFilmTemplate(filteredFilms[i]));
      }
    });
  }
}


for (let i = 0; i < FILM_RATED_COUNT; i++) {
  renderTemplate(filmListRated, createCardFilmTemplate(sortFilmsRated(filteredFilms)[i]));
}

for (let i = 0; i < FILM_RATED_COUNT; i++) {
  renderTemplate(filmListCommented, createCardFilmTemplate(sortFilmsCommented(filteredFilms)[i]));
}

// const filmCards = document.querySelectorAll(`.film-card`);

siteBody.addEventListener('click', (evt) => {
  // console.log('click');
  const target = evt.target;
  if (target.classList.contains('js-open-popup')) {
    showPopup(target.closest('.film-card').dataset.id)
  }
});

/**
 * Функция показа полной карточки фильма
 * @param {string} id - id фильма
 */
const showPopup = (id) => {
  const film = films.filter((item) => item.id === id)[0];
  renderTemplate(siteBody, createTemplatePopupFilm(film));
};

siteBody.addEventListener('click', (evt) => {
  const target = evt.target;
  if (target.classList.contains('film-details__close-btn') === true) {
    document.querySelector('.film-details').remove();
  }
});
