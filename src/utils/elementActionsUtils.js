import AbstractView from '../view/abstract';

/**
 * Функция создания HTML элемента
 * @param {string} template - HTML элемент в формате строки, который будет вложен в container
 * @param {Object} newElement.firstChild - созданный HTML элемент
 */
export const createElement = (template) => {
  const newElement = document.createElement('div'); // 1
  newElement.innerHTML = template;

  return newElement.firstChild;
};

/**
 * Функция обновления элемента массива
 * @param {Array} items - массив данных
 * @return {Object} update - элемент для замены
 */
export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

/**
 * Функция замены элемента с помощью replaceChild
 * @param {Object} newChild - новый элемент
 * @return {Object} oldChild - старый элемент
 */
export const replace = (newChild, oldChild) => {
  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }


  if (oldChild === null || newChild === null) {
    return;
  }

  const parent = oldChild.parentElement;
  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  component.getElement().remove();
  component.removeElement();
};
