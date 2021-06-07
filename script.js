const tasks = [
    // {
    //   _id: '5d2ca9e2e03d40b326596aa7',
    //   completed: true,
    //   body:
    //     'Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n',
    //   title: 'Eu ea incididunt sunt consectetur fugiat non.',
    // },
    // {
    //   _id: '5d2ca9e29c8a94095c1288e0',
    //   completed: false,
    //   body:
    //     'Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n',
    //   title:
    //     'Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum.',
    // },
];

  
//Самовызывающаяся функция (чтобы избежать случайного переопределения переменных)
(function() {

    const objOfTasks = tasks.reduce(( acc, task ) => {          //создаем объект объектов (работать с массивом будет сложно)
        acc[task._id] = task;
        return acc;
    }, {});

    //Elements UI
    const listContainer = document.querySelector('.tasks-list-section .list-group');
    const container = document.querySelector('.container');

    //Form Elements UI
    const form = document.forms['addTask'];     //ищем формы на странице по атрибуду "name"
    const inputTitle = form.elements['issueTitleInput']; //ищем input с именем issueTitleInput
    const selectGrade = form.elements['issueSeverityInput']; //ищем select с именем issueSeverityInput
    const inputBody = form.elements['issueDescrInput']; //ищем input с именем issueDescrInput
    const completedTasks = document.querySelector('.list-of-completed-tasks');
    deleteMessageEmpty();

    renderAllTasks(objOfTasks);

    form.addEventListener('submit', onFormSubmitHandler); //вешаем на форму обработчик события submit
    listContainer.addEventListener('click', onDeleteHandler); //т.к генерируем li динамично через JS (используем делегирование)
    container.addEventListener('click', onCompleteHandler);



    function renderAllTasks( tasksList ) {      //выводит задачи непосредственно на страницу


        if( !tasksList ) {
          console.error('Передайте список задач');
          return;
        };

        const fragment = document.createDocumentFragment();     //создаем фрагмент, куда помещаем созданные задачи
        Object.values(tasksList).forEach( task => {             //превращаем в массим и получаем отдельную задачу
            const li = listItemTemplate( task );                //вызываем на каждой итерации
            fragment.appendChild(li);
        } );

        const div = completedTasksList();
        completedTasks.appendChild(div);


        listContainer.appendChild(fragment);

    };


    function listItemTemplate({ _id, title, body } = {}) {      //создает отдельную li (сразу деструктурируем)
        
        const li = document.createElement('li');

        li.classList.add(
            'list-group-item', 
            'd-flex', 
            'align-items-center', 
            'flex-wrap', 
            'uncompleted-task'
        );
        li.style.border = '1px solid #b4acac';
        li.style.marginBottom = 15 + 'px'
        li.setAttribute('data-task-id', _id); //навешиваем атрибут (для возможности удаления задачи)

        const span = document.createElement('span');  //создаем заголовок
        span.textContent = title;
        span.style.fontWeight = 'bold';

        const deleteBtn = document.createElement('button');  //создаем кнопку удаления
        deleteBtn.textContent = 'Delete task';
        deleteBtn.classList.add(
            'btn', 
            'btn-danger', 
            'ml-auto', 
            'delete-btn'
        );

        const article = document.createElement('p');   //создаем тело задачи
        article.textContent = body;
        article.classList.add('mt-2', 'w-100');

        const doneBtn = document.createElement('button');
        doneBtn.textContent = 'DONE';
        doneBtn.classList.add(
          'btn', 
          'btn-success', 
          'ml-auto', 
          'done-btn'
      );
        

        //добавляем в li созданные элементы
        li.appendChild(span);
        li.appendChild(deleteBtn);
        li.appendChild(article);
        li.appendChild(doneBtn);

        const elem = document.querySelector('.list-empty');
          if(elem) {
            deleteMessageEmpty();
          };
        

        return li;         //возвращаем, т.к. вызываем функцию в другом месте
    };


    function onFormSubmitHandler(e) {   //формируем части задачи (получаем значения с input-ов)
      e.preventDefault();

      const titleValue = inputTitle.value;
      const bodyValue = inputBody.value;

      if(!titleValue || !bodyValue) {   //базовая проверка на то, что данные введены (кроме select, т.к. стоит по молчанию)
        alert('Введите пожалуйста данные в форму!'); 
        return;
      };

      const task = createNewTask(titleValue, bodyValue);
      const listItem = listItemTemplate(task); //добавляем новую задачу в контейнер со всеми задачами
      listContainer.insertAdjacentElement('afterbegin', listItem); //добавляем перев всем контейнером (перед всеми другими)
      form.reset(); //сбрасываем состояние формы (очищаем input)
    };


    function createNewTask(title, body) {      //создание отдельной объекта задачи

       const newTask = {    //формируем объект задачи
        title, 
        body,
        completed: false,
        _id: `task - ${Math.random()}` //генерируем рандомный id для задачи
       }

      objOfTasks[newTask._id] = newTask; //создаем новую задачу под новым id

      return { ...newTask }; //ждя дальнейшего использования делаем поверхностное копирование

    };


    function deleteTask(id) {   //удаление задачи из списка
      const { title } = objOfTasks[id]; //через деструктуризацию достаем название задачи
      const isConfirm = confirm(`Вы действительно ходите удалить задачу: \n ${ title }?`);
      if(!isConfirm) return isConfirm; //если нет подтверждения, то прекращаем следующие действия
      delete objOfTasks[id];

      return isConfirm;
    };


    function deleteTaskFromHtml(confirmed, element) {   //удаление задачи из разметки
      if(!confirmed) return;
      element.remove();

      const elem = document.querySelector('li');
      if(!elem) {
        isTasksInObj();
      };
    };


    function onDeleteHandler(e) {
      if(e.target.classList.contains('delete-btn')) {
        const parent = e.target.closest('[data-task-id]'); //ищем ближайшего родителя с данным атрибутом (соответствующий li-элемент)
        const id = parent.dataset.taskId; //получаем id задачи
        const confirmed = deleteTask(id);
        deleteTaskFromHtml(confirmed, parent);
      };


      if(e.target.classList.contains('done-btn')) {
        Object.values(objOfTasks).forEach( task => {
          task.completed = true;
      });
        const parent = e.target.closest('[data-task-id]');
        parent.style.background = 'lightgreen';
        parent.classList.remove('uncompleted-task');
        parent.classList.add('completed-task');
      };

    };


    function isTasksInObj() {   //сообщение о пустом списке задач
        const isEmpty = document.createElement('p');
        isEmpty.textContent = 'TASK LIST IS EMPTY!';
        isEmpty.classList.add('list-empty')
        isEmpty.style.fontWeight = 600;
        isEmpty.style.fontSize = 25 + 'px';
        isEmpty.style.color = '#ff0c4f';
        isEmpty.style.textAlign = 'center';
        listContainer.insertAdjacentElement('afterbegin', isEmpty);
    };


    function deleteMessageEmpty() {   //уделение из разметки сообщения о пустом списке задач
      const del = document.querySelector('.list-empty');
      if(!del) {
        isTasksInObj()
      } else {
        del.remove();
      };
    };


    function check(e) { //проверка, что лист с задачами пуст (вызывет функцию, которая выводит ссобщение о пустом лсите)
      if(Object.keys(e).length == 0) {
        isTasksInObj();
      } else {
        return;
      };
    };


    function completedTasksList() {   //создаем кнопки фильтрации задач(завершенные и незавершенные)
      const div = document.createElement('div');

      div.setAttribute('class', 'div-btn');

      const completedTask = document.createElement('button');

      completedTask.textContent = 'Completed Tasks';
      completedTask.classList.add(
          'btn', 
          'btn-warning', 
          'ml-auto', 
          'completed-btn',
          'mr-4',
          'mb-3'
      );

      const unCompletedTask = document.createElement('button');

      unCompletedTask.textContent = 'Unfinishes Tasks';
      unCompletedTask.classList.add(
          'btn', 
          'btn-info', 
          'ml-auto', 
          'uncompleted-btn',
          'mb-3',
          'mr-4',
      );

      const AllTasks = document.createElement('button');

      AllTasks.textContent = 'All Tasks';
      AllTasks.classList.add(
          'btn', 
          'btn-primary', 
          'ml-auto', 
          'all-tasks-btn',
          'mb-3',
      );

      div.appendChild(completedTask);
      div.appendChild(unCompletedTask);
      div.appendChild(AllTasks);

      return div;

    };


    function onCompleteHandler(e) {

      if(e.target.classList.contains('uncompleted-btn')) {
        const parents = document.querySelectorAll('li');
        parents.forEach(tasks => {
          if(tasks.classList.contains('completed-task')) {
            tasks.style.visibility = 'hidden';
          } else if(tasks.classList.contains('uncompleted-task')) {
            tasks.style.visibility = 'visible';
          };
        });
      };

      if(e.target.classList.contains('completed-btn')) {
        const parents = document.querySelectorAll('li');
        parents.forEach(tasks => {
          if(tasks.classList.contains('uncompleted-task')) {
            tasks.style.visibility = 'hidden';
          } else if(tasks.classList.contains('completed-task')) {
            tasks.style.visibility = 'visible';
          };
        });
      };

      if(e.target.classList.contains('all-tasks-btn')) {
        const parents = document.querySelectorAll('li');
        parents.forEach(tasks => {
          tasks.style.visibility = 'visible';
        });
      };
    };


} (tasks));
