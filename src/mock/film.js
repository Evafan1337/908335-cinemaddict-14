import {nanoid} from 'nanoid';
import {getRandomInteger} from './utils';
import {generateRating} from './utils';
import {generateInfo} from './utils';
import {choise} from './utils';
import {generateDescription} from './utils';
import {generateTime} from './utils';
import {generateRandomComments} from './comments';

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
export const generateFilm = () => {
  return {
    id: nanoid(),
    info: generateInfo(),
    description: generateDescription(),
    time: generateTime(),
    date: new Date(getRandomInteger(0, new Date())),
    genre: choise(GENRES, getRandomInteger(1, GENRES.length - 1)),
    comments: generateRandomComments(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    isViewed: Boolean(getRandomInteger(0, 1)),
    isWatchlist: Boolean(getRandomInteger(0, 1)),
    rating: generateRating(0, 9),
    age: getRandomInteger(0, 18),
    regisseur: choise(REGISSEURS, 1),
    screenwriters: choise(SCREENWRITERS, getRandomInteger(1, SCREENWRITERS.length - 1)),
    actors: choise(ACTORS, getRandomInteger(1, ACTORS.length - 1)),
    country: choise(COUNTRIES, getRandomInteger(1, COUNTRIES.length - 1)),
  };
};
