import {nanoid} from 'nanoid';
import {getRandomInteger} from './utils';
import {generateComment} from './utils';

/**
 * Функция создания объекта комментария
 * Поля заполняются методами из этого файла
 * @return {object}
 */
export const generateComments = () => {
  return {
    id: nanoid(),
    info: generateComment(),
    date: new Date(getRandomInteger(0, new Date())),
  };
};
