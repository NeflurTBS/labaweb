// файл ./app.js
const express = require('express');
const mysql = require('mysql');
const config = require('./config');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

let nodemailer = require('nodemailer');
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


app.post('/addFolder', (req, res) => {

  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, config.jwtSecret);
  const userId = decoded.id; // Получаем идентификатор текущего пользователя из токена

  // Получение имени папки из тела запроса
  console.log('req.body: ', req.body);
  const folderName = req.body.folderName;
 

  // Проверка наличия имени папки в теле запроса
  if (!folderName) {
    res.status(400).send('Не указано имя папки');
    return;
  }

  // SQL-запрос для добавления записи с указанным именем в таблицу folder
  const sqlQuery = `INSERT INTO folder (name, user_id) VALUES ('${folderName}', '${userId}');`;

  // Выполнение SQL-запроса к базе данных
  dbConnection.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Ошибка выполнения запроса: ' + err.stack);
      res.status(500).send('Ошибка сервера');
      return;
    }
    console.log('Запись успешно добавлена в таблицу folder');
    res.send('Запись успешно добавлена в таблицу folder');
  });
});

// Регистрация пользователя

app.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "todoconfirm735@gmail.com",
        pass: "oqwoqjmumbxvntxl" 
      },
    });

    // Сохранение пользователя в базе данных
    dbConnection.query(
      `INSERT INTO users (name, pass, email) VALUES (?, ?, ?)`,
      [username, hashedPassword, email],
      async (err, result) => {
        if (err) {
          console.error('Ошибка выполнения запроса: ' + err.stack);
          res.status(500).send('Ошибка сервера');
          return;
        }

        const userId = result.insertId;

		    // Генерация токена подтверждения почты, который живет 1 день
        const emailConfirmToken = jwt.sign({ userId, email }, config.jwtSecret, { expiresIn: '1d' });

        // Сохранение кода подтверждения в таблице email_confirmation
        dbConnection.query(
          `INSERT INTO email_confirmation (userId, emailConfirmToken) VALUES (?, ?)`,
          [userId, emailConfirmToken],
          (err, result) => {
            if (err) {
              console.error('Ошибка сохранения кода подтверждения: ' + err.stack);
              res.status(500).send('Ошибка сервера');
              return;
            }

            console.log('Код подтверждения успешно создан');

            // Отправка письма с подтверждением почты
            const mailOptions = {
              from: 'todoconfirm735@gmail.com',
              to: email,
              subject: 'Подтверждение регистрации',
              html: `<p>Для подтверждения регистрации перейдите по ссылке: <a href="http://localhost:10000/confirm/${emailConfirmToken}">Подтвердить регистрацию</a></p>`
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error('Ошибка при отправке письма:', error);
                res.status(500).send('Ошибка сервера');
              } else {
                console.log('Письмо с подтверждением отправлено:', info.response);
                res.status(201).send('Пользователь успешно зарегистрирован. Проверьте вашу почту для подтверждения регистрации.');
              }
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    res.status(500).send('Ошибка сервера');
  }
});

app.get('/confirm/:token', async (req, res) => {
  try {
    const token = req.params.token;

    // Раскодирование токена
    const decoded = jwt.verify(token, config.jwtSecret);
    const { userId, email } = decoded;

    // Поиск кода подтверждения в базе данных
    dbConnection.query(
      `SELECT * FROM email_confirmation WHERE userId = ? AND emailConfirmToken = ?`,
      [userId, token],
      (err, results) => {
        if (err) {
          console.error('Ошибка выполнения запроса: ' + err.stack);
          res.status(500).send('Ошибка сервера');
          return;
        }

        if (results.length === 0) {
          res.status(404).send('Код подтверждения не найден');
          return;
        }

        // Удаление кода подтверждения из таблицы email_confirmation
        dbConnection.query(
          `DELETE FROM email_confirmation WHERE userId = ? AND emailConfirmToken = ?`,
          [userId, token],
          (err, result) => {
            if (err) {
              console.error('Ошибка удаления кода подтверждения: ' + err.stack);
              res.status(500).send('Ошибка сервера');
              return;
            }

            console.log('Код подтверждения успешно удален');

            // Можно пометить пользователя как подтвержденного в таблице users
            // Например: UPDATE users SET isConfirmed = true WHERE id = userId;
            
            dbConnection.query(
              `UPDATE users SET isConfirmed = true WHERE id = ?`,
              [userId],
              (err, result) => {
                if (err) {
                  console.error('Ошибка изменения подтверждения почты: ' + err.stack);
                  res.status(500).send('Ошибка сервера');
                  return;
                }
                console.log('Статус подтверждения изменён');
              }
            );
            res.status(200).send('Регистрация успешно подтверждена');
          }
        );
      }
    );
  } catch (error) {
    console.error('Ошибка при подтверждении регистрации:', error);
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
        const token = jwt.sign({ name: user.name, id: user.id }, config.jwtSecret);
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
    req.user.id = decoded.id;
    res.status(200).json({ name: decoded.name });
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    res.status(401).send('Неверный токен');
  }
});

// Пример маршрута Express для получения задач текущего пользователя
app.get('/getTasks', (req, res) => {

  let userId;
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    userId = decoded.id; // Получаем идентификатор текущего пользователя из токена
    
  } 
  catch (error) {
    console.error('Ошибка при проверке токена:', error);
    res.status(401).send('Неверный токен');
  }

  // Запрос задач, принадлежащих текущему пользователю
  dbConnection.query(
    `SELECT * FROM tasks WHERE user_id = ?`,
    [userId],
    (err, results) => {
      if (err) {
        console.error('Ошибка выполнения запроса: ' + err.stack);
        res.status(500).send('Ошибка сервера');
        return;
      }
      console.log('Задачи текущего пользователя:', results);
      res.json(results);
    }
  );
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

  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, config.jwtSecret);
  const userId = decoded.id; // Получаем идентификатор текущего пользователя из токена

  // Получение имени задачи из тела запроса
  console.log('req.body: ', req.body);
  const taskName = req.body.name;
 

  // Проверка наличия имени задачи в теле запроса
  if (!taskName) {
    res.status(400).send('Не указано имя задачи');
    return;
  }

  // SQL-запрос для добавления записи с указанным именем в таблицу tasks
  const sqlQuery = `INSERT INTO tasks (name, user_id) VALUES ('${taskName}', '${userId}');`;

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

app.get('/healthcheck', (req, res) => res.sendStatus(200));

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
