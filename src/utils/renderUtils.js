import AbstractView from '../view/abstract';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

/**
 * Функция рендера компонента
 * @param {object} container - HTML элемент в который будет "вложен" элемент template
 * @param {string} template - HTML элемент в формате строки, который будет вложен в container
 * @param {string} place - аргумент для insertAdjacentHTML (параметр вставки)
 */
export const render = (container, element, place = 'beforeend') => {
  
  if (element instanceof AbstractView) {
    element = element.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

/**
 * Функция рендера шаблона
 * @param {object} container - HTML элемент в который будет "вложен" элемент template
 * @param {string} template - HTML элемент в формате строки, который будет вложен в container
 * @param {string} place - аргумент для insertAdjacentHTML (параметр вставки)
 */
export const renderTemplate = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};