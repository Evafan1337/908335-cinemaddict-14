import {nanoid} from 'nanoid';
import {getRandomInteger} from './utils';
import {generateRating} from './utils';
import {generateInfo} from './utils';
import {choise} from './utils';
import {generateDescription} from './utils';
import {generateRandomComments} from './comments';
import dayjs from 'dayjs';

const REGISSEURS = [
  'Anthony Mann',
  'Christopher Jonathan',
  'Steven Spielberg',
  'Martin Scorsese',
  'Alfred Hitchcock',
];

const SCREENWRITERS = [
  'Билли Уайлдер',
  'Итан и Джоэл Коэны',
  'Роберт Таун',
  'Квентин Тарантино',
  'Френсис Форд Коппола',
];

const GENRES = [
  'Comedy',
  'Cartoon',
  'Drama',
  'Western',
  'Musical',
];

const COUNTRIES = [
  'USA',
  'Great Britain',
  'Canada',
  'France',
  'Russia',
];

const ACTORS = [
  'Alan Rickman',
  'Benedict Cumberbatch',
  'Benicio del Toro',
  'Vincent Cassel',
  'Viggo Mortensen',
];

/**
 * Функция создания объекта фильма
 * Поля заполняются методами из этого файла
 * @return {object}
 */
const generateFilm = () => {

  const isViewed = Boolean(getRandomInteger(0, 1));
  const date = new Date(getRandomInteger(0, new Date()));
  const watchedData = (isViewed) ? dayjs().add(getRandomInteger(-30, 0), 'days') : null;

  return {
    id: nanoid(),
    info: generateInfo(),
    description: generateDescription(),
    // time: generateTime(),
    time: getRandomInteger(30, 180),
    // date: new Date(getRandomInteger(0, new Date())),
    date,
    genre: choise(GENRES, getRandomInteger(1, GENRES.length - 1)),
    comments: generateRandomComments(getRandomInteger(0, 5)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    // isViewed: Boolean(getRandomInteger(0, 1)),
    isViewed,
    isWatchlist: Boolean(getRandomInteger(0, 1)),
    rating: generateRating(0, 9),
    age: getRandomInteger(0, 18),
    regisseur: choise(REGISSEURS, 1),
    screenwriters: choise(SCREENWRITERS, getRandomInteger(1, SCREENWRITERS.length - 1)),
    actors: choise(ACTORS, getRandomInteger(1, ACTORS.length - 1)),
    country: choise(COUNTRIES, getRandomInteger(1, COUNTRIES.length - 1)),
    watchedData,
  };
};

export const generateFilms = (FILM_COUNT) => {
  return new Array(FILM_COUNT).fill().map(generateFilm);
};
