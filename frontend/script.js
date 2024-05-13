// файл ./frontend/script.js
var myModal = document.getElementById('myModal');

const ShowDeleteTask = document.getElementById("taskFormDelete");
const ShowAddTask = document.getElementById("taskFormAdd");
const ShowUpdateTask = document.getElementById("taskFormUpdate");

function showhide(d) {
  d.style.display = (d.style.display !== "none") ? "none" : "block";
}


  document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Пользователь аутентифицирован, делаем что-то...
      // Например, получаем данные пользователя или показываем защищенные части приложения
      // Вы можете отправить запрос на /profile маршрут для получения данных о пользователе
      // Или просто показать определенные элементы интерфейса, доступные только аутентифицированным пользователям
     console.log(token);
    } else {
      // Пользователь не аутентифицирован, показываем форму входа и/или регистрации
      // Например:
     
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
  // Обработка формы входа
  document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
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
        var tr = document.createElement('tr');
        tr.innerHTML = 
        `<td>
          <span id="taskFromTable${task.id}">${task.name}</span>
          <form id="taskFormUpdateTable${task.id}" style="display: none" class="CRUD">
            <input type="text" id="taskUpdateTextTable${task.id}" placeholder="${task.name}" required/>
            <button class="secondaryButton" onclick=UpdateByButton(taskUpdateTextTable${task.id},${task.id})>Редактировать</button>
          </form>
        </td> 
        <td>
          <button class="UpdateImageButton" onclick="ShowHideUpdate(taskFormUpdateTable${task.id},taskFromTable${task.id})"></button>
          <button class="DeleteImageButton" id="${task.id}" onclick="DeleteByButton(id)"></button>
        </td>`;
        taskList.appendChild(tr);
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
document.getElementById('taskFormAdd').addEventListener('submit', function (event) {
  event.preventDefault(); // Предотвращаем перезагрузку страницы
  const taskInput = document.getElementById('taskInput');
  const taskName = taskInput.value.trim();
  if (taskName !== '') {
    addTask(taskName); // Вызываем функцию добавления задачи
    taskInput.value = ''; // Очищаем поле ввода
    showhide(ShowAddTask);
  }
});

function UpdateTask(taskName,idTask) {
  fetch('http://localhost:3000/UpdateTask', {
    method: 'PUT', headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify({name: taskName, id: idTask})
  })
    .then(response => response.text())
    .then(message => {
      console.log(message);
      loadTasks(); // После добавления задачи перезагружаем список задач
    })
    .catch(error => console.error('Error updating task:', error));
}

function ShowHideUpdate(show,hide){
  show.style.display = (show.style.display !== "none") ? "none" : "block";
  hide.style.display = (hide.style.display !== "none") ? "none" : "block";
}

// Обработчик события отправки формы

function UpdateByButton(task,id){
  UpdateTask(task.value,id);
}

/*document.getElementById('taskFormUpdate').addEventListener('submit', function (event) {
  event.preventDefault(); // Предотвращаем перезагрузку страницы
  const taskUpdateId = document.getElementById('taskUpdateId');
  const taskUpdateText = document.getElementById('taskUpdateText');
  const taskName = taskUpdateText.value.trim();
  const idTask = taskUpdateId.value.trim();
  if (taskName !== '' && idTask!=='') {
    UpdateTask(taskName,idTask); // Вызываем функцию добавления задачи
    taskUpdateId.value = ''; // Очищаем поле ввода
    taskUpdateText.value = '';
    showhide(ShowUpdateTask);
  }
});*/


function DeleteTask(idTask) {
  fetch('http://localhost:3000/DeleteTask', {
    method: 'DELETE', headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify({id: idTask})
  })
    .then(response => response.text())
    .then(message => {
      console.log(message);
      loadTasks(); // После добавления задачи перезагружаем список задач
    })
    .catch(error => console.error('Error deleting task:', error));
}

function DeleteByButton(id){
  var result = confirm("Want to delete?");
  if   (result) {
    DeleteTask(id)
  }  
}
// Обработчик события отправки формы
/*document.getElementById('taskFormDelete').addEventListener('submit', function (event) {
  event.preventDefault(); // Предотвращаем перезагрузку страницы
  const taskDelete = document.getElementById('taskDelete');
  
  const idTask = taskDelete.value.trim();
  if (idTask!=='') {
    DeleteTask(idTask); // Вызываем функцию добавления задачи
    taskDelete.value = ''; // Очищаем поле ввода
    showhide(ShowDeleteTask);
  }
});*/

// После загрузки страницы сразу загружаем задачи
loadTasks();
