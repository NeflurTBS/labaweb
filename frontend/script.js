// файл ./frontend/script.js
var myModal = document.getElementById('myModal')

document.addEventListener('DOMContentLoaded', () => {
  // Обработка формы входа
  document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('name').value;
    const password = document.getElementById('pass').value;
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      localStorage.setItem('token', data.token); // Сохранение токена в localStorage
      alert('Вы успешно вошли');
    } catch (error) {
      console.error('Ошибка при входе:', error);
      alert('Ошибка при входе');
    }
  });

  // Обработка формы регистрации
  document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: newUsername, password: newPassword })
      });
      alert('Пользователь успешно зарегистрирован');
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      alert('Ошибка при регистрации');
    }
  });
});
// Функция для загрузки задач с сервера
function loadTasks() {
	// Предполагаем, что сервер запущен на localhost:3000
	// Также предполагаем, что у вас метод получения всех задач называется getTasks и находится на данном пути
  fetch('http://localhost:3000/getTasks')
    .then(response => response.json())
    .then(tasks => {
      const taskList = document.getElementById('taskList');
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.name;
        taskList.appendChild(li);
      });
    })
    .catch(error => console.error('Error fetching tasks:', error));
}

// Функция для добавления задачи на сервер
function addTask(taskName) {
  fetch('http://localhost:3000/addTask', {
    method: 'POST', headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify({name: taskName})
  })
    .then(response => response.text())
    .then(message => {
      console.log(message);
      loadTasks(); // После добавления задачи перезагружаем список задач
    })
    .catch(error => console.error('Error adding task:', error));
}

// Обработчик события отправки формы
document.getElementById('taskForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Предотвращаем перезагрузку страницы
  const taskInput = document.getElementById('taskInput');
  const taskName = taskInput.value.trim();
  if (taskName !== '') {
    addTask(taskName); // Вызываем функцию добавления задачи
    taskInput.value = ''; // Очищаем поле ввода
  }
});

// После загрузки страницы сразу загружаем задачи
loadTasks();
