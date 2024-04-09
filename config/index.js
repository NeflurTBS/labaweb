// файл ./config/index.js
const fs = require('fs');

const config = {
	db: {
    mysql : {
      host: 'db-mysql-fra1-51752-do-user-9208055-0.c.db.ondigitalocean.com', // Или IP-адрес вашего сервера MySQL
      user: 'user5', // Имя пользователя MySQL
      password: 'AVNS_2mKZiWro3wXO8GpymFc',// Пароль пользователя MySQL
      database: 'db5', // Имя вашей базы данных
      port: 25060, // порт базы данных
			ssl: {
			  ca: fs.readFileSync('ca-certificate-test.crt'), // Путь к файлу ca.crt
			}
    },
  }, 
  port: 3000 // порт на котором будет запущен сервер приложения
};

module.exports =  config;
