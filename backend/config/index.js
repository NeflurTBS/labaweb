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
			  ca: fs.readFileSync('/etc/secrets/ca-certificate-test.crt'), // Путь к файлу ca.crt
			}
    },
  }, 
  port: 10000, // порт на котором будет запущен сервер приложения
  jwtSecret: 'fa7ea77ba91fc531286b6bd0b3dcfc519646e1d71d3adf4c19eb7d17b64d903b' // Секретный ключ для подписи и верификации JWT токенов, вы его либо сами генерируете, либо сами придумываете
};

module.exports =  config;
