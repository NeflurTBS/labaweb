// файл ./frontend/script.js
var myModal = document.getElementById("myModal");

const ShowDeleteTask = document.getElementById("taskFormDelete");
const ShowAddTask = document.getElementById("taskFormAdd");
const ShowUpdateTask = document.getElementById("taskFormUpdate");


function showhide(d) {
  d.style.display = d.style.display !== "none" ? "none" : "block";
}

// Пример запроса задач текущего пользователя на клиенте
const fetchTasks = async () => {
  try {
    const response = await fetch('/getTasks', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // Передача токена авторизации
      }
    });
    const data = await response.json();
    console.log('Задачи текущего пользователя:', data);
    // Далее обрабатываем полученные задачи на клиенте
  } catch (error) {
    console.error('Ошибка при получении задач:', error);
  }
};

// Показать имя пользователя
function showUserName() {
  fetch('https://labaweb.onrender.com/getUserName', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then((response) => response.json())
  .then((userName) => {
    console.log(userName);
    document.getElementById('nameUser').textContent = `Вы вошли в систему как: ${userName}`;
    let buttonRegistr = document.getElementById("buttonRegistr");
          let buttonAutoriz = document.getElementById("buttonAutoriz");
          buttonRegistr.style.display="none";
          buttonAutoriz.style.display="none";
  })
}

document.addEventListener("DOMContentLoaded", () => {
  /*if (token) {
  const url = "https://labaweb.onrender.com/profile"; // URL API, который вы вызываете
  const token = localStorage.getItem("token"); // Токен, полученный после аутентификации

    // Опции для fetch запроса
    const options = {
        method: 'GET', // Метод запроса
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Включение токена в заголовки запроса
        }
    };

    // Отправляем запрос на сервер
    fetch(url, options)
        .then(response => {
            // Проверяем, успешно ли выполнен запрос
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Распарсиваем ответ в формате JSON
        })
        .then(data => {
          var nameUser = document.getElementById("nameUser").getElementsByClassName("span"); 
          nameUser.innerHTML = data;
      
          let buttonRegistr = document.getElementById("buttonRegistr");
          let buttonAutoriz = document.getElementById("buttonAutoriz");
          buttonRegistr.style.display="none";
          buttonAutoriz.style.display="none";
        })
        .catch(error => {
            // Обработка ошибок в случае неудачного запроса или других проблем
            console.error('There was a problem with your fetch operation:', error);
        });
      }
  else{

  }*/
});

document.addEventListener("DOMContentLoaded", () => {
  // Обработка формы входа
  document
    .getElementById("loginForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      try {
        const response = await fetch("https://labaweb.onrender.com/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        localStorage.setItem("token", data.token); // Сохранение токена в localStorage
        alert("Вы успешно вошли");
        location.reload();
      } catch (error) {
        console.error("Ошибка при входе:", error);
        alert("Ошибка при входе");
      }
      location.reload();
    });
  });
document.addEventListener("DOMContentLoaded", () => {
  // Обработка формы регистрации
  document
    .getElementById("registerForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const newUsername = document.getElementById("newUsername").value;
      const newPassword = document.getElementById("newPassword").value;
      const email = document.getElementById("email").value;
      try {
        const response = await fetch("https://labaweb.onrender.com/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: newUsername,
            password: newPassword,
            email:email
          }),
        });
        alert("Пользователь успешно зарегистрирован");
      } catch (error) {
        console.error("Ошибка при регистрации:", error);
        alert("Ошибка при регистрации");
      }
    });
});

// Функция для загрузки задач с сервера
function loadTasks() {
  // Предполагаем, что сервер запущен на localhost:10000
  // Также предполагаем, что у вас метод получения всех задач называется getTasks и находится на данном пути
  fetch("https://labaweb.onrender.com/getTasks", 
  {headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}` // Передача токена авторизации
    }
  })
    .then((response) => response.json())
    .then((tasks) => {
      const taskList = document.getElementById("taskList");
      taskList.innerHTML = "";
      tasks.forEach((task) => {
        var tr = document.createElement("tr");
        tr.innerHTML = `<td>
          <span id="taskFromTable${task.id}">${task.name}</span>
          <form id="taskFormUpdateTable${task.id}" style="display: none" class="CRUD">
            <input type="text" id="taskUpdateTextTable${task.id}" placeholder="${task.name}" required/>
            <button class="secondaryButton" onclick=UpdateByButton(taskUpdateTextTable${task.id},${task.id})>Изменить</button>
          </form>
        </td> 
        <td>
          <button class="UpdateImageButton" onclick="ShowHideUpdate(taskFormUpdateTable${task.id},taskFromTable${task.id})"></button>
          <button class="DeleteImageButton" id="${task.id}" onclick="DeleteByButton(id)"></button>
        </td>`;
        taskList.appendChild(tr);
      });
    })
    .catch((error) => console.error("Error fetching tasks:", error));
}

// Функция для добавления задачи на сервер
function addTask(taskName) {
  fetch("https://labaweb.onrender.com/addTask", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: taskName }),
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
      loadTasks(); // После добавления задачи перезагружаем список задач
    })
    .catch((error) => console.error("Error adding task:", error));
}

// Обработчик события отправки формы
document
  .getElementById("taskFormAdd")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы
    const taskInput = document.getElementById("taskInput");
    const taskName = taskInput.value.trim();
    if (taskName !== "") {
      addTask(taskName); // Вызываем функцию добавления задачи
      taskInput.value = ""; // Очищаем поле ввода
      showhide(ShowAddTask);
    }
  });

function UpdateTask(taskName, idTask) {
  fetch("https://labaweb.onrender.com/UpdateTask", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: taskName, id: idTask }),
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
      loadTasks(); // После добавления задачи перезагружаем список задач
    })
    .catch((error) => console.error("Error updating task:", error));
}

function ShowHideUpdate(show, hide) {
  show.style.display = show.style.display !== "none" ? "none" : "block";
  hide.style.display = hide.style.display !== "none" ? "none" : "block";
}

// Обработчик события отправки формы

function UpdateByButton(task, id) {
  UpdateTask(task.value, id);
}

function DeleteTask(idTask) {
  fetch("https://labaweb.onrender.com/DeleteTask", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: idTask }),
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
      loadTasks(); // После добавления задачи перезагружаем список задач
    })
    .catch((error) => console.error("Error deleting task:", error));
}

function DeleteByButton(id) {
  var result = confirm("Вы уверены что хотите удалить задачу?");
  if (result) {
    DeleteTask(id);
  }
}

// После загрузки страницы сразу загружаем задачи
loadTasks();