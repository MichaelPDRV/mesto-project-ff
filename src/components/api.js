const config  = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-1',
  headers: {
    authorization: 'd6d665c4-4253-4c19-bf5a-1b59714ba0c7',
    'Content-Type': 'application/json'
  }
}

/* Учитываем случай, когда сервер вернул ошибку */

const response = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

/* Получение карточек с сервера */

export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  })
  .then(response)
}

/* Отправка карточки на сервер */

export const updateInitialCards = (cardName, cardLink) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: cardName,
      link: cardLink
    })
  })
  .then(response)
}

/* Удаление карточки с сервера */

export const deleteCards = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  })
  .then(response)
}

/* Поставить лайк */

export const likeCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers,
  })
  .then(response)
}

/* Убрать лайк */

export const disLikeCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  })
  .then(response)
}

/* Получение инфы с сервера о профиле */

export const getProfileInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  })
  .then(response)
}

/* Обновление инфы профиля на сервере */

export const updateProfileInfo = (profileName, profileInfo) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: profileName,
      about: profileInfo
    })
  })
  .then(response)
}

/* Изменение аватара */

export const changeAvatar = (url) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: url
    })
  })
  .then(response)
}
