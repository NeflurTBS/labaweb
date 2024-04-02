// файл ./app.js
const express = require('express');
const mysql = require('mysql');
const config = require('./config');

const app = express();
const port = config.port;

app.use(express.json());

// Конфигурация подключения к базе данных
const dbConnection = mysql.createConnection(config.db.mysql);

// Подключение к базе данных
dbConnection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных: ' + err.stack);
    return;
  }
  console.log('Подключение к базе данных успешно установлено');
});

// Пример маршрута Express
app.get('/getTasks', (req, res) => {

  // Получение имени задачи из тела запроса
  console.log('req.body: ', req.body);
  const taskName = req.body.name;

  // Проверка наличия имени задачи в теле запроса
  if (!taskName) {
    res.status(400).send('Не указано имя задачи');
    return;
  }

  // Пример запроса к базе данных
  dbConnection.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Ошибка сервера');
      return;
    }
    console.log('Результаты запроса:', results);
    res.json(results);
  });
});

app.get('/getIDtask', (req, res) => {

  // Получение имени задачи из тела запроса
  console.log('req.body: ', req.body);
  const taskName = req.body.name;

  // Проверка наличия имени задачи в теле запроса
  if (!taskName) {
    res.status(400).send('Не указано имя задачи');
    return;
  }

  // Пример запроса к базе данных
  const idTask = req.body.id;
  dbConnection.query(`SELECT * FROM tasks WHERE id=('${idTask}')`, (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Ошибка сервера');
      return;
    }
    console.log('Результаты запроса:', results);
    res.json(results);
  });
});

app.delete('/DeleteTask', (req, res) => {

  // Получение имени задачи из тела запроса
  console.log('req.body: ', req.body);
  const taskName = req.body.name;

  // Проверка наличия имени задачи в теле запроса
  if (!taskName) {
    res.status(400).send('Не указано имя задачи');
    return;
  }

  // Пример запроса к базе данных
  const idTask = req.body.id;
  dbConnection.query(`DELETE FROM tasks WHERE id=('${idTask}')`, (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Ошибка сервера');
      return;
    }
    console.log('Результаты запроса:', results);
    res.json(results);
  });
});

app.put('/UpdateTask', (req, res) => {

  // Получение имени задачи из тела запроса
  console.log('req.body: ', req.body);
  const taskName = req.body.name;

  // Проверка наличия имени задачи в теле запроса
  if (!taskName) {
    res.status(400).send('Не указано имя задачи');
    return;
  }

  // Пример запроса к базе данных
  const idTask = req.body.id;
  
  dbConnection.query(`UPDATE tasks SET name=('${taskName}') WHERE id=('${idTask}')`, (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Ошибка сервера');
      return;
    }
    console.log('Результаты запроса:', results);
    res.json(results);
  });
});

// Пример маршрута Express для добавления записи в таблицу tasks с указанным именем
app.post('/addTask', (req, res) => {

  // Получение имени задачи из тела запроса
  console.log('req.body: ', req.body);
  const taskName = req.body.name;

  // Проверка наличия имени задачи в теле запроса
  if (!taskName) {
    res.status(400).send('Не указано имя задачи');
    return;
  }

  // SQL-запрос для добавления записи с указанным именем в таблицу tasks
  const sqlQuery = `INSERT INTO tasks (name) VALUES ('${taskName}')`;

  // Выполнение SQL-запроса к базе данных
  dbConnection.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Ошибка сервера');
      return;
    }
    console.log('Запись успешно добавлена в таблицу tasks');
    res.send('Запись успешно добавлена в таблицу tasks');
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});