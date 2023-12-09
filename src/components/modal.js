/* Открытия попапа */

export function openPopup(popup){

  popup.classList.add('popup_is-animated');

  setTimeout(() => {
    popup.classList.add('popup_is-opened');
    popup.classList.remove('popup_is-animated');
  }, 0);

  document.addEventListener('keydown', EscClosePopup);
  document.addEventListener('mousedown', clickOverlay);

}

/* Закрытия попапа */

export function closePopup(popup){

  popup.classList.add('popup_is-animated');

  setTimeout(() => {
    popup.classList.remove('popup_is-opened');
  }, 0);

  setTimeout(() => {
    popup.classList.remove('popup_is-animated');
  }, 600);

  document.removeEventListener('keydown', EscClosePopup);
  document.removeEventListener('mousedown', clickOverlay);

}

/* Если нажать клавишу Escape, вызовим функция закрытия попапа */

function EscClosePopup(evt) {
  if (evt.key === 'Escape') {
    const popup = document.querySelector('.popup_is-opened');
    closePopup(popup);
  }
};

/* Закрытие попапа кликом на оверлей */

function clickOverlay(event) {
  if (event.target.classList.contains('popup_is-opened') ||
    event.target.classList.contains('popup_is-animated')) {
      closePopup(event.target.closest('.popup'));
  }
};
