# Техническое решение

## **Основная идея реализации**

В результате реализации будет доступен новый сервис, работающий для функционала TODO-листа.

## **Изменяемые микросервисы или инфраструктурные сервисы**

- работа с репозиторием githab Labaweb
- верстка страницы при помощи html и css

## **Особенности деплоя**

- адаптивность в frontend достигается благодаря алаптивной сетке flexboxgrid2, хостинг осуществляется на бесплатном хостинг-сервере netify

## **Контракт взаимодействия с клиентами**

| Регистрация |  |
| --- | --- |
| Endpoint | POST /api/todo/registr |
| Description | Метод для регистрации на сайте |
| Request |
| Response |
| Errors | • ERR_EMAIL_ALREADY_REGISTR - почта уже зарегистрированна в приложении
• ERR_VALIDATION_FAILED_PASS - пароль содержит неподдерживаемые символы
• ERR_LENGTH_PASS - неверная длинна пароля |

| Подверждение регистрации через почту |  |
| --- | --- |
| Endpoint | POST /api/todo/confirmEmailCode |
| Description | Метод для подтвержения регистрации |
| Request |
| Response |
| Errors | • ERR_EMAIL_ALREADY_REGISTR - почта уже зарегистрированна в приложении
• ERR_EMAIL_WRONG - несуществующая почта

| Авторизация |  |
| --- | --- |
| Endpoint | POST /api/todo/autoriz |
| Description | Метод для авторизации на сайте |
| Request |
| Response |
| Errors | • ERR_EMAIL_ALREADY_REGISTR - почта уже зарегистрированна в приложении
• ERR_EMAIL_WRONG - несуществующая почта

| Создание задачи |  |
| --- | --- |
| Endpoint | POST /api/todo/creatTask |
| Description | Метод для создания задач |
| Request |
| Response |
| Errors | • ERR_EMPTY - пустое поле

| Редактирование задачи |  |
| --- | --- |
| Endpoint | POST /api/todo/editTask |
| Description | Метод для редактирования задач |
| Request |
| Response |
| Errors | • ERR_EMPTY - пустое поле

| Удаление задачи |  |
| --- | --- |
| Endpoint | POST /api/todo/deleteTask |
| Description | Метод для удаления задач |
| Request |
| Response |
| Errors | 

| Создание папок для задач |  |
| --- | --- |
| Endpoint | POST /api/todo/creatDir |
| Description | Метод для создания папок |
| Request |
| Response |
| Errors | • ERR_EMPTY - пустое поле

| Сортировка |  |
| --- | --- |
| Endpoint | POST /api/todo/sorting |
| Description | Метод для сортировки |
| Request |
| Response |

| Поиск папок и задач |  |
| --- | --- |
| Endpoint | POST /api/todo/search |
| Description | Метод для поиска папок и задач |
| Request |
| Response |
| Errors | • ERR_EMPTY_NAME - нет введенных символов



> **Не стоит путать клиентов - с пользователями**.

**Клиент** - это frontend и все те, кто взаимодействует с сервером для получения данных и их управления.
**Сервер** - это backend и все те, кто данные обрабатывает для клиентов.
> 

## **Детальное описание ТР**

Будет создан новый сервис - `todo-service` в рамках которого реализован функционал TODO-листа.

Адаптивност страницы достигается при помощи flexboxgrid2:

`<div class="row">`
   `<div class="col-xs-12 col-sm-8 col-md-6 col-lg-4 col-xl-2">`
        `<div>Responsive</div>`
    `</div>`
`</div>`


### Папки

**Папка** - представляет собой список для задач.

Папки необходимы для группировки задач по различным критериям

### Представление задач

**Задача** - сущность, создаваемая пользователем.


## **Использованная литература**

- [Создание Todo List](https://itchief.ru/javascript/todo-list#development)
- [ToDo list](https://todoist.com/ru)