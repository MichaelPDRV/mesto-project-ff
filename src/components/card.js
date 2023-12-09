import {likeCard, disLikeCard} from '../components/api.js';

const MyAccountId = "bf33a6011bb37d2123365725";

/* Создания карточки */

export function createCard(cardData, popDelFunction, popOpFunction, likeFunction, MyAccountId){
  const cardTemplate = document.querySelector('#card-template').content;
  const cardCopy = cardTemplate.querySelector('.card').cloneNode(true);
  cardCopy.id = cardData['_id'];
  const cardImage = cardCopy.querySelector('.card__image');
  const cardDeleteButton = cardCopy.querySelector('.card__delete-button');
  const cardTitle = cardCopy.querySelector('.card__title');
  const cardLikeButton = cardCopy.querySelector('.card__like-button');
  const cardLikeCount = cardCopy.querySelector('.card__like-count');
  const searchID = cardData.likes.find((el) => el['_id'] === MyAccountId);
  cardImage.src = cardData.link;
  cardImage.alt = cardTitle.textContent = cardData.name;
  cardLikeCount.textContent = cardData.likes.length;
  cardImage.addEventListener('click', popOpFunction);
/* Удаление своей карточки и проверяем наличие своих лайков на карточках */
  if (cardData.owner['_id'] != MyAccountId) {
    cardDeleteButton.style.display = 'none';
  }
  else {
    cardDeleteButton.addEventListener('click', () => {
      popDelFunction(cardCopy.id);
    });
  }
  if (searchID) {
    cardLikeButton.classList.add('card__like-button_is-active');
  }
  cardLikeButton.addEventListener('click', () => {
    likeFunction(cardLikeButton, cardLikeCount, cardCopy.id);
  });
  return cardCopy;
}

/* Лайки в карточках */

export function clickOnLikeCard(likeButton, likeCountElement, cardId){
  if (likeButton.classList.contains('card__like-button_is-active')) {
    disLikeCard(cardId)
    .then(data => {
      likeButton.classList.remove('card__like-button_is-active');
      likeCountElement.textContent = data.likes.length;
  })
    .catch(console.error);
  }
  else {
    likeCard(cardId)
    .then(data => {
      likeButton.classList.add('card__like-button_is-active');
      likeCountElement.textContent = data.likes.length;
    })
    .catch(console.error);
  }
}

