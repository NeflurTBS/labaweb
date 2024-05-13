// файл ./app.js
const express = require('express');
const mysql = require('mysql');
const config = require('./config');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = config.port;

app.use(cors());
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


// файл ./backend/app.js

// Регистрация пользователя
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    // Сохранение пользователя в базе данных
    dbConnection.query(
      `INSERT INTO users (name, pass) VALUES ('${username}', '${hashedPassword}')`,
      (err, result) => {
        if (err) {
          console.error('Ошибка выполнения запроса: ' + err.stack);
          res.status(500).send('Ошибка сервера');
          return;
        }
        console.log('Пользователь успешно зарегистрирован');
        res.status(201).send('Пользователь успешно зарегистрирован');
      }
    );
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    res.status(500).send('Ошибка сервера');
  }
});

// Вход пользователя
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Поиск пользователя в базе данных
    dbConnection.query(
      `SELECT * FROM users WHERE name = '${username}'`,
      async (err, results) => {
        if (err) {
          console.error('Ошибка выполнения запроса: ' + err.stack);
          res.status(500).send('Ошибка сервера');
          return;
        }
        if (results.length === 0) {
          res.status(401).send('Неверные учетные данные');
          return;
        }
        
        const user = results[0];
        // Проверка пароля
        const passwordMatch = await bcrypt.compare(password, user.pass);
        if (!passwordMatch) {
          res.status(401).send('Неверные учетные данные');
          return;
        }
        // Генерация JWT токена
        const token = jwt.sign({ name: user.name }, config.jwtSecret,{expiresIn: '1h'});
        res.status(200).json({ token });
      }
    );
  } catch (error) {
    console.error('Ошибка при входе пользователя:', error);
    res.status(500).send('Ошибка сервера');
  }
});

// Проверка аутентификации с использованием JWT
app.get('/profile', (req, res) => {
  // Получение токена из заголовка Authorization
  const token = req.headers.authorization.split(' ')[1];
  try {
    // Проверка токена
    const decoded = jwt.verify(token, config.jwtSecret);
    res.status(200).json({ name: decoded.name });
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    res.status(401).send('Неверный токен');
  }
});

// Пример маршрута Express
app.get('/getTasks', (req, res) => {

  // Получение имени задачи из тела запроса
  console.log('req.body: ', req.body);

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
  const taskID = req.body.id;

  // Проверка наличия имени задачи в теле запроса
  if (!taskID) {
    res.status(400).send('Не указано имя задачи');
    return;
  }

  // Пример запроса к базе данных
  
  dbConnection.query(`SELECT * FROM tasks WHERE id=('${taskID}')`, (err, results) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Ошибка сервера');
      return;
    }
    console.log('Результаты запроса:', results);
    if(results.length==0){
      res.status(400).send('нет такого id')
    }
    res.json(results);
  });
});

app.delete('/DeleteTask', (req, res) => {

  // Получение имени задачи из тела запроса
  console.log('req.body: ', req.body);
  const taskID = req.body.id;

  // Проверка наличия имени задачи в теле запроса
  if (!taskID) {
    res.status(400).send('Не указано имя задачи');
    return;
  }

  // Пример запроса к базе данных
  dbConnection.query(`DELETE FROM tasks WHERE id=('${taskID}')`, (err, results) => {
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
  const idTask = req.body.id;

  // Проверка наличия имени задачи в теле запроса
  if (!taskName) {
    res.status(400).send('Не указано имя задачи');
    return;
  }

  if (!idTask) {
    res.status(400).send('Не указан id задачи');
    return;
  }

  // Пример запроса к базе данных
  
  
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
  const sqlQuery = `INSERT INTO tasks (name, user_id) VALUES (${taskName}, user_id);`;

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
