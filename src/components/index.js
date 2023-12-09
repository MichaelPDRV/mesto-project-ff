import '../pages/index.css';
import {createCard, clickOnLikeCard} from '../components/card.js';
import {openPopup, closePopup} from '../components/modal.js';
import {enableValidation, clearValidation} from '../components/validation.js';
import {getInitialCards, updateInitialCards, deleteCards, getProfileInfo, updateProfileInfo, changeAvatar} from '../components/api.js';

/* Объявляем константы */

const profileEditPopup = document.querySelector('.popup_type_edit');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileEditForm = document.forms['edit-profile'];
const profileAvatar = document.querySelector('.profile__image');
const profileName = document.querySelector('.profile__title');
const profileTitle = document.querySelector('.profile__description');
const editFormNameInput = profileEditForm.elements.name;
const editFormjobInput = profileEditForm.elements.description;
const editFormSubmitButton = profileEditForm.querySelector('.popup__button');

const avatarEditPopup = document.querySelector('.popup_type_edit-avatar');
const avatarEditButton = document.querySelector('.profile__image-edit');
const avatarEditForm = document.forms['edit-avatar'];
const avatarFormInput = avatarEditForm.elements.url;
const avatarFormSubmitButton = avatarEditForm.querySelector('.popup__button');

const cardAddPopup = document.querySelector('.popup_type_new-card');
const cardAddButton = document.querySelector('.profile__add-button');
const cardDeletePopup = document.querySelector('.popup_type_delete-card');
const cardForm = document.forms['new-place'];
const cardDescription = cardForm.elements['place-name'];
const cardUrlLink = cardForm.elements.link;
const cardFormSubmitButton = cardForm.querySelector('.popup__button');
const cardDeleteForm = document.forms['delete-card'];
const cardDeleteFormButton = cardDeleteForm.querySelector('.popup__button');
const cardPopup = document.querySelector('.popup_type_image');
const cardPopupImage = cardPopup.querySelector('.popup__image');
const cardPopupCaption = cardPopup.querySelector('.popup__caption');

const closeButtonsList = document.querySelectorAll('.popup__close');

const cardsPlace = document.querySelector('.places__list');

let myAccountId = '';

/* Конфигурация валидации */

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
}

/* Включаем валидацию во всех формах */

enableValidation(validationConfig);

/* Добавление карточки в контейнер */

function renderCard(data, conteiner){
  conteiner.append(createCard(data, openDeletePopup, openImage, clickOnLikeCard, myAccountId));
}

/* Запрашиваем информацию по пользователю и карточкам с сервера, чтоб потом отобразить их */

Promise.all([getInitialCards, getProfileInfo])
  .then(() => {
  getProfileInfo()
  .then((data) => {
    myAccountId = data['_id'];
    profileName.textContent = data.name;
    profileTitle.textContent = data.about;
    profileAvatar.style.backgroundImage = `url('${data.avatar}')`;
  })
  .catch((err) => console.log(`Ошибка! ${err}`))

  getInitialCards()
  .then(data => {
    data.forEach((el) => {renderCard(el, cardsPlace)})
  })
  .catch((err) => console.log(`Ошибка! ${err}`))
})

/* Открытие попапа для редактирвания аватара */

avatarEditButton.addEventListener('click', () => {
  avatarEditForm.reset();
  clearValidation(avatarEditForm, validationConfig);
  openPopup(avatarEditPopup);
})

/* Открытие попапа редактирвания профиля */

profileEditButton.addEventListener('click', () => {
  editFormNameInput.value = profileName.textContent;
  editFormjobInput.value = profileTitle.textContent;
  clearValidation(profileEditForm, validationConfig);
  openPopup(profileEditPopup);
});

/* Открытие попапа для добавления карточки */

cardAddButton.addEventListener('click', () => {
  cardForm.reset();
  clearValidation(cardForm, validationConfig);
  openPopup(cardAddPopup);
});

/* Открытие попапа картинки */

function openImage(evt){
  cardPopupImage.src = evt.target.src;
  cardPopupImage.alt = cardPopupCaption.textContent = evt.target.alt;
  openPopup(cardPopup);
}

/* Попап удаления с присвоением модальному окну id удаляемой карточки */

function openDeletePopup(id){
  cardDeleteFormButton.dataset.id = id;
  openPopup(cardDeletePopup);
}

/* Зарытия попапа по клику на крестик */

function closeModalByCross(evt){
  const targerPopup = evt.target.closest('.popup');
  closePopup(targerPopup);
}
closeButtonsList.forEach((el) => {
  el.addEventListener('click', closeModalByCross);
});

/* Редактирвания и обновлвение профиля */

function profileFormSubmit(evt){
  evt.preventDefault();
  editFormSubmitButton.textContent = 'Сохранение...';
  updateProfileInfo(editFormNameInput.value, editFormjobInput.value)
  .then((data) => {
    profileName.textContent = data.name;
    profileTitle.textContent = data.about;
    closePopup(profileEditPopup);
  })
  .catch((err) => console.log(`Ошибка! ${err}`))
  .finally(() => {
    editFormSubmitButton.textContent = 'Сохранить';
  });
}
profileEditForm.addEventListener('submit', profileFormSubmit);

/* Редактирвания и обновлвение аватара */

function avatarFormSubmit(evt) {
  evt.preventDefault()
  avatarFormSubmitButton.textContent = 'Сохранение...';
  changeAvatar(avatarFormInput.value)
  .then((data) => {
    profileAvatar.style.backgroundImage = `url('${data.avatar}')`;
    closePopup(avatarEditPopup);
  })
  .catch((err) => console.log(`Ошибка! ${err}`))
  .finally(() => {
    avatarFormSubmitButton.textContent = 'Сохранить';
  });
}
avatarEditForm.addEventListener('submit', avatarFormSubmit);

/* Добавление новой карточки */

function addCard(evt){
  evt.preventDefault();
  cardFormSubmitButton.textContent = 'Сохранение...';
  const newCard = {
    name: cardDescription.value,
    link: cardUrlLink.value,
  };
  updateInitialCards(newCard.name, newCard.link)
  .then((data) => {
    cardsPlace.prepend(createCard(data, openDeletePopup, openImage, clickOnLikeCard));
    closePopup(cardAddPopup);
  })
  .catch((err) => console.log(`Ошибка! ${err}`))
  .finally(() => {
    cardFormSubmitButton.textContent = 'Сохранить';
  });
}
cardForm.addEventListener('submit', addCard);

/* Удаление карточки */

function removeCard(evt){
  evt.preventDefault();
  const cardDeleteId = cardDeleteFormButton.dataset.id;
  deleteCards(cardDeleteId)
  .then(() => {
    const deleteTarget = document.querySelector(`[id='${cardDeleteId}']`);
    deleteTarget.remove();
    closePopup(cardDeletePopup);
  })
  .catch((err) => console.log(`Ошибка! ${err}`))
}
cardDeleteForm.addEventListener('submit', removeCard);
