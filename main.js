// 1.Check on the form submit,whether the input is blank or not. If it is blank then show the modal,otherwise add to the task list.
// 2. on pressing delete button,we need to remove the task.
// 3. we need to store and load all the tasks from application storage
let emptyInputModalInstance;
const form           =          document.querySelector('#task-form');
const taskList       =          document.querySelector('#taskList');
const clearAllBtn  =          document.querySelector('#clearAll');
const taskInput    =          document.querySelector('#task');
const filterTask     =          document.querySelector('#filter-task');
const title             =          document.querySelector('#task-title');
loadEvents();
function loadEvents(){
    document.addEventListener('DOMContentLoaded',onLoad);

    form.addEventListener('submit',addTask);

    clearAllBtn.addEventListener('click',clearAllTasks);

    taskList.addEventListener('click',removeTask);

    filterTask.addEventListener('keyup',showFilteredTasks);

    taskInput.addEventListener('keyup',beforeAddTask);
}

function onLoad(e){
        var elems=document.querySelector('#emptyInputModal');
        emptyInputModalInstance=M.Modal.init(elems);
        loadItemsFromStorage();
}
function addTask(e){
    e.preventDefault();
    const input=taskInput.value;
    if(input===''){
        emptyInputModalInstance.open();
        return;
    }

    //add to list
    addTaskElement(input);

    //add to local storage
    addToLocalStorage(input);
    //make input blank
    taskInput.value='';
    title.textContent='';
}

function clearAllTasks(e){
    e.preventDefault();
    let tasks =[];
    //slower method of removing all child objects
    //taskList.innerHTML='';
    //faster method of removing all child objects

    while(taskList.firstChild){
        taskList.removeChild(taskList.firstChild);
    }
    localStorage.setItem('tasks',JSON.stringify(tasks));
}

function removeTask(e){
    e.preventDefault();
    if(isDeleteButton(e.target)){
        let taskValue='';
        if(e.target.parentElement.nodeName==='LI'){
            taskValue=e.target.parentElement.textContent;
            taskValue=taskValue.substring(0,taskValue.indexOf('delete'));
            e.target.parentElement.remove();
        }else{
                taskValue=e.target.parentElement.parentElement.textContent;
                taskValue=taskValue.substring(0,taskValue.indexOf('delete'));

                e.target.parentElement.parentElement.remove();
        }
        removeFromLocalStorage(taskValue);
    }
}
function beforeAddTask(e){
        e.preventDefault();
        title.textContent=taskInput.value;
}
function showFilteredTasks(e){
    const key=filterTask.value.toLowerCase();
    const lis=document.querySelectorAll('.collection-item');
    // console.log(li[0].textContent.indexOf('java));
    lis.forEach(function(li){
        let liText=li.textContent;
        let index=liText.toLowerCase()
                                .substring(0,liText.indexOf('delete'))
                                .indexOf(key);
        
        if(index<0){
            li.style.display='none';
        }else{
            li.style.display='block';
        }
    });
}

function isDeleteButton(el){
    if(el.classList.contains('delete-task') || el.parentElement.classList.contains('delete-task')){
        return true;
    }return false;
}
function loadItemsFromStorage(){
    const tasks=JSON.parse(localStorage.getItem('tasks'));
    if(tasks!==null){
        tasks.forEach(function(task){
            addTaskElement(task);
        });
    }
}

function addTaskElement(task){
    //create a LI
    const li=document.createElement('li');
    li.className='collection-item';
    li.appendChild(document.createTextNode(task));

    //create anchor tag
    const a =document.createElement('a');
    a.classList.add('secondary-content');
    a.classList.add('delete-task');
    a.href='#';
    a.innerHTML='<i class="material-icons">delete</i>';

    li.appendChild(a);
    taskList.appendChild(li);
}

function addToLocalStorage(task){
    let tasks;
    let storageTasks=localStorage.getItem('tasks');
    if(storageTasks===null){
        tasks=[];
    }else{
        tasks=JSON.parse(storageTasks);
    }
    tasks.push(task);
    localStorage.setItem('tasks',JSON.stringify(tasks));
}

function removeFromLocalStorage(tasksToBeDeleted){
    let tasks=[];
    let storageTasks=localStorage.getItem('tasks');
    if(storageTasks===null){
        alert("There is some sync issue with localstorage! please connect with admin!")
    }else{
        tasks=JSON.parse(storageTasks);
        tasks=tasks.filter(function(task){
            return task===tasksToBeDeleted ? false :true;
        });
        localStorage.setItem('tasks',JSON.stringify(tasks));
    }
}