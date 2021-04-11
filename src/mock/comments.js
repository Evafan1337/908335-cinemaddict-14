import {nanoid} from 'nanoid';
import {getRandomInteger} from './utils';
import {generateComments} from './utils';

/**
 * Функция генерация времени + рандом
 * @return {string}
 */
export const generateRandomComments = () => {
  const COMMENT_COUNT = getRandomInteger(0, 5);
  const randomComments = new Array(COMMENT_COUNT).fill(null).map((index) => generateComments(index));
  return randomComments;
};
