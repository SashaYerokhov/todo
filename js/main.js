// Находим элементы на странице
const form = document.querySelector('#form');
// console.log(form);
const taskInput = document.querySelector('#taskInput');
// console.log(taskInput);
const tasksList = document.querySelector('#tasksList');
// console.log(tasksList);
const emptyList = document.querySelector('#emptyList');

// Создадим массив, который будет содержать все задачи
let tasks = [];

// При обновлении страницы задачи должны остаться
// Если есть какие-то данные то должны его получить
if(localStorage.getItem('tasks')) {
    // console.log(localStorage.getItem('tasks'));
    // JSON.parse(localStorage.getItem('tasks'));

    tasks = JSON.parse(localStorage.getItem('tasks'));
}

tasks.forEach(function (task) {
    const cssClass = task.done ? "task-title task-titlze--done" : "task-title";


    const taskHTML = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${task.text}</span>
    <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
    </div>
</li>`;


    tasksList.insertAdjacentHTML('beforeend', taskHTML);
})

checkEmptyList();

// Вешаем прослушку на форму
// form.addEventListener('submit', function (event) {


// })
form.addEventListener('submit', addTask);

// Проверим хранится ли что-то в localStorage по ключу tasksHTML

// if(localStorage.getItem('tasksHTML')) {
//     tasksList.innerHTML = localStorage.getItem('tasksHTML');
// }


// Фукнция добавить задачу

function addTask(event) {
    // console.log('SUBMIT!!!');
    // отменяем стандарт поведение формы и отменяем перезагрузку
    event.preventDefault();
    // console.log('SUBMIT!!!');

    // Достаем текст задачи из поля ввода
    // Создаем переменную в которой передаем введеное в input
    const taskText = taskInput.value;
    // console.log(taskText);

    // Объект кот будет описывать задачу, перед добав в массив
    const newTasks = {
        id: Date.now(), // время в милисекундах
        text: taskText,
        done: false,
    };

    // Добавляем задачу в массив с задачами
    tasks.push(newTasks);
    // console.log(tasks);

    // Добавляем задачу в хранилище браузера LocalStorage
    saveToLocalStorage();
    // Если задача выполнена добавляется клас task-title--done
    // const cssClass = условие ? if true : if false; тернар оператор

    const cssClass = newTasks.done ? "task-title task-titlze--done" : "task-title";

    // Формируем разметку для новой задачи, 
    // для того чтобы добавить задачу на страницу мы должны 
    // отобразить ее в HTML-разметке, которая описывает разметку для задачи
    const taskHTML = `
    <li id="${newTasks.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${newTasks.text}</span>
    <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
    </div>
</li>`;
    // console.log(taskHTML);

    // Добавляем задачу на страницу
    // Мы должны обратиться к списку с задачами, кусок разметки 
    // должны добавить в тег ul, где находятся все задачи, найдем его на странице

    tasksList.insertAdjacentHTML('beforeend', taskHTML);
    // Ощищаем поле ввода и возращаем на него фокус
    // после того как добавили задачу, необходимо очистить input, чтобы вводить новую задачу, не удаляя ее самим, а чтобы она удалилась сама - автоматически

    // очищаем input
    taskInput.value = '';

    // переместим на него фокус
    taskInput.focus();

    // Когда добавляем задачи, необходимо, что надпись "Список дел пуста", исчезала

    // Если в списке задач более 1-го элемента, то мы его скрываем
    // нужно проверить есть ли какие-то задачи в списке
    // обращаемся к тегу ul и смотрим если там тегов li больше 1
    // добавляем класс
    // if (tasksList.children.length > 1) {
    //     emptyList.classList.add('none');
    // }
    // saveHTMLtoLS();
    checkEmptyList();

}

// Удаление задач
// У нас есть список задач, у которой есть кнопка для удаления задачи, и по нажати на кнопку у нас должен удаляться тег li, котщрый отвечает за написание этой задачи, отследить кнопку и по клику этой кнопку удаляет тег li со странице, клик по всему списку 

tasksList.addEventListener('click', deleteTask)

// Функция удаления задачи, проверяем произошел ли клик по кноп удалить
function deleteTask(event) {
    // console.log('deleteTask');
    // показываем по которому произошел клик
    // console.log(event.target);

    // У каждой кнопки есть data-атрибуты, и проверяем 
    // есть data-action="delete"
    // от этой кнопку найдем тег li и его удалим

    // Провереяем если клик был НЕ по кнопке удалить задачу
    if (event.target.dataset.action !== 'delete') {
        return
    }
    // Когда функция встречает return - происходит выход из функции, если кликнули не по кнопку удалить - функция закончит свою работу

    // if (event.target.dataset.action === 'delete') {}
    // console.log('DELETE!!!');
    const parentNode = event.target.closest('.list-group-item');
    //    console.log(parentNode);

    // У каждой задачи есть свой id и по этому мы можем удалить задачу из данных
    // console.log(parentNode.id);
    // Определим id в отдельную переменную
    const id = Number(parentNode.id);

    // Найдем индекс и удалим по индексу
    // const index = tasks.findIndex(function(task) {
    //     // console.log(task);
    //     // if(task.id === id) {
    //     //     return true
    //     // } или
    //     return task.id === id;

    // })

    // или по-другому записать
    const index = tasks.findIndex((task) => task.id === id);

    // console.log(index); номер индекса в массива

    // Удаляем задачу из массива с задачами
    tasks.splice(index, 1)

    // Удаляем задачу через фильтрацию массива
    // Отфильтруем массив tasks
    // tasks = tasks.filter(function (task) {
    //     if(task.id === id) {
    //         return false
    //     } else {
    //         return true;
    //     }
    // }) сокращение кода
    // tasks = tasks.filter((task) => task.id !== id)
    // Добавляем задачу в хранилище браузера LocalStorage
    saveToLocalStorage();


    // Удаляем задачу из разметки
    parentNode.remove();

    // Если задач нет - возвращается надпись - Список дел пуст
    // if (tasksList.children.length === 1) {
    //     emptyList.classList.remove('none');
    // }
    // saveHTMLtoLS();
    checkEmptyList();

}

// Отметка - что задача выполнена
tasksList.addEventListener('click', doneTask)

// Функция - что задача выполнена
function doneTask(event) {
    // 

    // console.log('doneTask');
    // Проверям, что кли был по кнопка "Задача выполнена"
    if (event.target.dataset.action === 'done') {
        // console.log('DONE!!!');
        // находим span и добавляем к нему класс
        const parentNode = event.target.closest('.list-group-item');
        // console.log(parentNode);

        // найдем по id задачи, по id задачи найдем в массиве
        // с задачи и поменяем свойство done false - true
        const id = Number(parentNode.id);

        // так же можно сократить до стрелочной функции
        // const task = tasks.find((task) => return task.id === id);
        const task = tasks.find(function (task) {
            if (task.id === id) {
                return true;
            }
        })

        // console.log(task);
        // Объекты как и массивы передаются по ссылке, когда метод find
        // возвращает объект, он возрвщает ссылку на этот объект
        task.done = !task.done;
        // изначально записано false, ! вернет - true

        // Добавляем задачу в хранилище браузера LocalStorage
        saveToLocalStorage();
        const taskTitle = parentNode.querySelector('.task-title');
        // console.log(taskTitle);
        taskTitle.classList.toggle('task-title--done');
    }
    // saveHTMLtoLS();

}

// Сделаем так, чтобы данные которые вводили сохранялись и были
// доступны и после перегрузки страницы
// Правильный способ - в работе с данными, необходимо создать
// массив, со всем задачами, хранить в LocalStorage только
// данные по задачам

// Неправильный способ, ф-я сохран наш список localStorage
// function saveHTMLtoLS() {
//     localStorage.setItem('tasksHTML', tasksList.innerHTML)
// }

// Функция для надписи - Список дел пуст
function checkEmptyList() {
    // console.log(tasks.length);
    // Если в массиве нет элементов (нет задач) отобразим блок на странице
    if (tasks.length === 0) {
        const emptyListHTML = `
        <li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>
        `;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }
    // если появилась хоть одна задача
    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
    saveToLocalStorage();
}

// Нужно чтобы массив задач при любых добавлениях, изменениях, 
// сохранялся в localStorage

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}



// 01:47:00