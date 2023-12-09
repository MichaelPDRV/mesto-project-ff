/* Показать ошибку */

function showInputError(form, formInput, errorMessage, inputErrorClass, errorClass) {
  const inputError = form.querySelector(`.${formInput.id}-error`);
  inputError.textContent = errorMessage;
  formInput.classList.add(inputErrorClass);
  inputError.classList.add(errorClass);
}

/* Скрыть ошибку */

function hideInputError(form, formInput, inputErrorClass, errorClass) {
  const inputError = form.querySelector(`.${formInput.id}-error`);
  formInput.classList.remove(inputErrorClass);
  inputError.classList.remove(errorClass);
}

/* Проверка валидности*/

function isValid(form, formInput, inputErrorClass, errorClass) {
  if (formInput.validity.patternMismatch) {
    formInput.setCustomValidity(formInput.dataset.errorMessage);
  }
  else {
    formInput.setCustomValidity('');
  }
  if (!formInput.validity.valid) {
    showInputError(form, formInput, formInput.validationMessage, inputErrorClass, errorClass);
  }
  else {
    hideInputError(form, formInput, inputErrorClass, errorClass);
  }
}

/* Проверка валидности всех инпутов */

function hasInvalidInput(inputList) {
  return inputList.some(input => {
    return !input.validity.valid;
  })
}

/* Активация и деактивация кнопки */

function toggleButtonState(inputList, button, inactiveButtonClass) {
  if (hasInvalidInput(inputList)) {
    button.disabled = true;
    button.classList.add(inactiveButtonClass);
  }
  else {
    button.disabled = false;
    button.classList.remove(inactiveButtonClass);
  }
}

/* Вешаем слушатели на инпуты */

function setEventListeners(form, inputSelector, buttonSelector, inactiveButtonClass, inputErrorClass, errorClass) {
  const inputList = Array.from(form.querySelectorAll(inputSelector));
  const submitButton = form.querySelector(buttonSelector);
  toggleButtonState(inputList, submitButton, inactiveButtonClass);
  inputList.forEach(input => {
    input.addEventListener('input', () => {
      isValid(form, input, inputErrorClass, errorClass);
      toggleButtonState(inputList, submitButton, inactiveButtonClass);
    })
  });
}

/* Обходим в массиве все формы и вызываем функцию с слушатиелями на каждой форме */

export function enableValidation(validationConfig) {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));
  formList.forEach(form => {
    setEventListeners(form, validationConfig.inputSelector, validationConfig.submitButtonSelector, validationConfig.inactiveButtonClass, validationConfig.inputErrorClass, validationConfig.errorClass);
  })
}

/* Очищаем все ошибки в валидации */

export function clearValidation(form, validationConfig) {
  const inputList = Array.from(form.querySelectorAll(validationConfig.inputSelector) );
  const submitButton = form.querySelector(validationConfig.submitButtonSelector);
  inputList.forEach(input => {
    hideInputError(form, input, validationConfig.inputErrorClass, validationConfig.errorClass);
  })
  submitButton.classList.add(validationConfig.inactiveButtonClass);
}
