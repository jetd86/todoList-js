const tasks = [
    {
        _id: '5d2ca9e2e03d40b326596aa7',
        completed: true,
        body:
            'Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n',
        title: 'Eu ea incididunt sunt consectetur fugiat non.',
    },

    {
        _id: '5d2cafasdf34asdgasf333',
        completed: false,
        body:
            'Test non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n',
        title: 'Eu ea incididunt sunt consectetur fugiat non. Test',
    },

    {
        _id: '5d2ca546345fasdf34asdgasf345643',
        completed: false,
        body:
            'Last Task non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n',
        title: 'Eu ea incididunt sunt consectetur fugiat non. last Task',
    },


];


//self-calling function, in order to close our names from global scope, made only for safety
(function (arrOfTasks) {

    //make a new object, where key will be ID from object task
    const objOfTasks = arrOfTasks.reduce((acc, task) => {
        acc[task._id] = task;
        return acc;
    }, {});

    const themes = {
        default: {
            '--base-text-color': '#212529',
            '--header-bg': '#007bff',
            '--header-text-color': '#fff',
            '--default-btn-bg': '#007bff',
            '--default-btn-text-color': '#fff',
            '--default-btn-hover-bg': '#0069d9',
            '--default-btn-border-color': '#0069d9',
            '--danger-btn-bg': '#dc3545',
            '--danger-btn-text-color': '#fff',
            '--danger-btn-hover-bg': '#bd2130',
            '--danger-btn-border-color': '#dc3545',
            '--input-border-color': '#ced4da',
            '--input-bg-color': '#fff',
            '--input-text-color': '#495057',
            '--input-focus-bg-color': '#fff',
            '--input-focus-text-color': '#495057',
            '--input-focus-border-color': '#80bdff',
            '--input-focus-box-shadow': '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
        },
        dark: {
            '--base-text-color': '#212529',
            '--header-bg': '#343a40',
            '--header-text-color': '#fff',
            '--default-btn-bg': '#58616b',
            '--default-btn-text-color': '#fff',
            '--default-btn-hover-bg': '#292d31',
            '--default-btn-border-color': '#343a40',
            '--default-btn-focus-box-shadow':
                '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
            '--danger-btn-bg': '#b52d3a',
            '--danger-btn-text-color': '#fff',
            '--danger-btn-hover-bg': '#88222c',
            '--danger-btn-border-color': '#88222c',
            '--input-border-color': '#ced4da',
            '--input-bg-color': '#fff',
            '--input-text-color': '#495057',
            '--input-focus-bg-color': '#fff',
            '--input-focus-text-color': '#495057',
            '--input-focus-border-color': '#78818a',
            '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
        },
        light: {
            '--base-text-color': '#212529',
            '--header-bg': '#fff',
            '--header-text-color': '#212529',
            '--default-btn-bg': '#fff',
            '--default-btn-text-color': '#212529',
            '--default-btn-hover-bg': '#e8e7e7',
            '--default-btn-border-color': '#343a40',
            '--default-btn-focus-box-shadow':
                '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
            '--danger-btn-bg': '#f1b5bb',
            '--danger-btn-text-color': '#212529',
            '--danger-btn-hover-bg': '#ef808a',
            '--danger-btn-border-color': '#e2818a',
            '--input-border-color': '#ced4da',
            '--input-bg-color': '#fff',
            '--input-text-color': '#495057',
            '--input-focus-bg-color': '#fff',
            '--input-focus-text-color': '#495057',
            '--input-focus-border-color': '#78818a',
            '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
        },
    };



    const listContainer = document.querySelector('ul.list-group');
    const form = document.forms['addTask'];
    const inputTitle = form.elements['title'];
    const inputBody = form.elements['body'];
    const themeSelect = document.getElementById('themeSelect');
    let uncompletedObject = null; //variable only for object with uncompleted tasks
    //if not null, that we have just clicked on the button of uncompleted tasks
    let lastSelectedTheme = localStorage.getItem('app_theme') || 'default';
    themeSelect.value = lastSelectedTheme;

    console.log(lastSelectedTheme);
    //EVENTS
    setTheme(lastSelectedTheme);
    renderAllTasks(sortingTasks()); //function that renders all tasks
    form.addEventListener('submit', onFormSubmitHandler);
    listContainer.addEventListener('click', onDeleteHandler);
    listContainer.addEventListener('click', onCompletedHandler);
    themeSelect.addEventListener('change', onThemeSelectHandler);
    
    function renderAllTasks(taskList) {
        if (!taskList) {
            console.error('Передайте список задач');
            return;
        }

        const fragment = document.createDocumentFragment();
        Object.values(taskList).forEach(task => {
            const li = listItemTemplate(task);
            //передаем во фрагмент наши LI, чтобы потом за 1 раз сформировать DOM
            //here we transfer one LI element to our fragment, to increase DOM speed
            fragment.appendChild(li);
        });
        return listContainer.appendChild(fragment);
    }

    //in this function we get one LI record for function and then we use this function in renderAlltasks in the loop
    function listItemTemplate({_id, title, body, completed} = {}) {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'align-items-center', 'flex-wrap', 'mt-2');
        li.setAttribute('data-task-id', _id);  //id need to remove a task
        li.setAttribute('completed', completed);
        const span = document.createElement('span');
        span.style.fontWeight = 'bold';
        span.textContent = title;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-outline-danger', 'btn-sm');
        deleteBtn.type = 'button';
        deleteBtn.textContent = 'удалить';

        const completedBtn = document.createElement('button');
        completedBtn.classList.add('btn', 'btn-outline-success', 'ml-auto', 'btn-sm');
        completedBtn.type = 'button';
        completedBtn.setAttribute('id', 'toComplete');
        completedBtn.textContent = 'Завершить';

        if (completed === true) {
            completedBtn.classList.add('disabled');
            completedBtn.classList.replace('btn-outline-success', 'btn-success');
            li.style.backgroundColor = "#add8e699";
            completedBtn.textContent = 'завершено';
        }


        const article = document.createElement('p');
        article.textContent = body;
        article.classList.add('mt-2', 'w-100');

        li.appendChild(span);
        li.appendChild(completedBtn);
        li.appendChild(deleteBtn);
        li.appendChild(article);
        return li;
    }

    //обработчик на форму
    function onFormSubmitHandler(e) {
        e.stopPropagation();
        e.preventDefault();
        const titleValue = inputTitle.value;
        const bodyValue = inputBody.value;

        if (!titleValue || !bodyValue) {
            alert('Пожалуйста введите название и текст задачи');
            return;
        }

        const task = createNewTask(titleValue, bodyValue);
        const listItem = listItemTemplate(task);
        listContainer.insertAdjacentElement("afterbegin", listItem);
        form.reset();
        notification();
        completedButtons();
    }

    function createNewTask(title, body) {
        const newTask = {
            _id: `task-${Math.random()}`,
            title,
            body,
            completed: false,
        };

        objOfTasks[newTask._id] = newTask;

        return {...newTask};
    }


    //DELETE TASK EVENT
    function deleteTaskFromObjOfTasks(id) {
        const isConfirm = confirm('Точно удалить задачу?');
        if (!isConfirm) return isConfirm;  //if do not delete, stop
        delete objOfTasks[id];
        return isConfirm;
    }

    function deleteTaskFromHTML(confirmed, el) {
        if (!confirmed) return;
        el.remove();
    }

    function onDeleteHandler(e) {
        const deleteButton = document.querySelector('button.btn-outline-danger');
        if (e.target.classList.contains('btn-outline-danger')) {
            const parent = e.target.closest('[data-task-id]');
            const id = parent.dataset.taskId;
            const confirmed = deleteTaskFromObjOfTasks(id);
            deleteTaskFromHTML(confirmed, parent);
            notification();
            completedButtons();
        }
    }

    function onCompletedHandler(e) {
        e.stopPropagation();
        e.preventDefault();

        const completedButton = e.target;
        const li = e.target.closest('li');
        const id = li.dataset.taskId;

        //i think this is not optimal, guess to reduce this code
        if (e.target.classList.contains('btn-outline-success')) {
            li.setAttribute('completed', true);
            objOfTasks[id].completed = true;
            completedButton.classList.replace('btn-outline-success', 'btn-success');
            li.style.backgroundColor = "#add8e699";
            completedButton.textContent = 'Завершено';
        } else if(e.target.classList.contains('btn-success')){
            li.removeAttribute('style');
            completedButton.classList.replace('btn-success', 'btn-outline-success');
            completedButton.textContent = 'Завершить';
            objOfTasks[id].completed = false;
        }

        deleteAllLi();
        renderAllTasks(sortingTasks());

        /*if uncompleted object isset and we have clicked on completed button, then
           make a click on button uncompleted tasks to renew our uncompleted Object
           function, see function UnCompletedTasksHandler
           Maybe it is not optimal, there is no time. Rafactor later. */
        if(uncompletedObject){
            document.querySelectorAll('div.completedButtons button')[1].click();
        }
    }
    
    //notice if we haven't any task;
    function notification() {
        //TODO think how to optimize this function
        const issetLI = document.querySelector('ul.list-group li');
        const cardBody = document.querySelector('div.col-8');
        let alertPrimary = document.querySelector('div.alert-primary');
        if (isEmptyObject(objOfTasks)) {
            cardBody.insertAdjacentHTML("beforeend", "<div class='alert alert-primary' role='alert'>Нет ни одной задачи</div>");
        }
        if (alertPrimary !== null) {
            document.querySelector('div.alert-primary').remove();
        }
    }


    //functional of all tasks and uncompleted tasks
    //adding buttons
    function completedButtons() {
        const div = document.createElement('div');
        div.classList.add('completedButtons');
        const allTasksBtn = document.createElement('button');
        allTasksBtn.textContent = 'Все задачи';
        allTasksBtn.classList.add('btn', 'btn-outline-primary',  'btn-sm');
        allTasksBtn.type = 'button';

        const uncompletedTasksButton = document.createElement('button');
        uncompletedTasksButton.classList.add('btn', 'btn-outline-warning', 'btn-sm');
        uncompletedTasksButton.textContent = 'Незавершенные задачи';
        uncompletedTasksButton.type = 'button';
        div.append(allTasksBtn, uncompletedTasksButton);


        let tasksButtons = document.querySelector('div.completedButtons');
        if (isEmptyObject(objOfTasks)  && tasksButtons) {
            tasksButtons.remove();
        } else if (tasksButtons) {
            return;
        } else {
            listContainer.insertAdjacentElement("beforebegin", div);
        }
    }
    completedButtons();

     //simple function to check, if object empty or not
    function isEmptyObject(obj) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    }

    let allTasksButton = document.querySelectorAll('div.completedButtons button')[0];
    let uncompletedTasksButton = document.querySelectorAll('div.completedButtons button')[1];
    
    function UnCompletedTasksHandler(e) {
        allTasksButton.classList.replace('btn-primary','btn-outline-primary');
        uncompletedTasksButton.classList.replace('btn-outline-warning','btn-warning');

         uncompletedObject = Object.keys(objOfTasks).reduce((acc, element) => {
            if (objOfTasks[element].completed === false) {
                acc[element] = objOfTasks[element];
            }
            return acc;
        }, {});

        deleteAllLi();
        renderAllTasks(uncompletedObject);
        console.log('uncompleted object btn', uncompletedObject);
    }


    function allTasksHandler(e) {
        allTasksButton.classList.replace('btn-outline-primary','btn-primary');
        uncompletedTasksButton.classList.replace('btn-warning','btn-outline-warning');
        deleteAllLi();
        uncompletedObject = null;
        renderAllTasks(sortingTasks());
        console.log('uncompleted object All tasks', uncompletedObject);
    }

    //sorting of uncompleted task, returns object for function renderAllTasks
    function sortingTasks() {
        let arr = Object.keys(objOfTasks).reduce((acc, el) => {
            acc.push(objOfTasks[el]);
            return acc.sort((prev, next) => prev.completed - next.completed)
        }, []);

        return arr.reduce((acc, task) => {
            acc[task._id] = task;
            return acc;
        }, {});
    }

    function deleteAllLi(){
        [...listContainer.children].forEach((el) => el.remove());
    }

    uncompletedTasksButton.addEventListener('click', UnCompletedTasksHandler);
    allTasksButton.addEventListener('click', allTasksHandler);



    function onThemeSelectHandler(e) {
       const selectedTheme = themeSelect.value;
       const isConfirmed = confirm(`Вы действительно хотите изменить тему на ${selectedTheme}`);
       if(!isConfirmed){
           themeSelect.value = lastSelectedTheme;
           return;
       }

       setTheme(selectedTheme);
        lastSelectedTheme = selectedTheme;
        localStorage.setItem('app_theme', selectedTheme);
    }


    function setTheme(themeName){
       let selectedThemeObj = themes[themeName];
       Object.entries(selectedThemeObj).forEach(([key, value]) => {
           document.documentElement.style.setProperty(key,value);
       });
    }

})(tasks);


