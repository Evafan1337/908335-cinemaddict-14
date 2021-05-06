import AbstractView from './abstract';

const ProfileRating = (count) => {
  if (count > 1 && count <= 10) {
    return 'Novice';
  } else if (count > 10 && count <= 20) {
    return 'Fan';
  } else {
    return 'Movie Buff';
  }
};

const createProfileTemplate = (count) => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${ ProfileRating(count) }</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
};

export default class Profile extends AbstractView {
  constructor(count) {
    super();
    this._element = null;
    this._count = count;
  }

  getTemplate() {
    return createProfileTemplate(this._count);
  }
}
