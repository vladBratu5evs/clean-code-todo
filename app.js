const taskInput = document.getElementById('new-task');
const addButton = document.getElementsByTagName('button')[0];
const incompleteTaskHolder = document.getElementById('incompleteTasks');
const completedTasksHolder = document.getElementById('completed-tasks');

const createNewTaskElement = function (taskString) {
  const listItem = document.createElement('li');
  const checkBox = document.createElement('input');
  const label = document.createElement('label');
  const editInput = document.createElement('input');
  const editButton = document.createElement('button');
  const deleteButton = document.createElement('button');
  const deleteButtonImg = document.createElement('img');

  label.innerText = taskString;
  label.className = 'task';

  checkBox.type = 'checkbox';
  editInput.type = 'text';
  editInput.className = 'task';

  editButton.innerText = 'Edit'; //innerText encodes special characters, HTML does not.
  editButton.className = 'edit';

  deleteButton.className = 'delete';
  deleteButtonImg.src = './remove.svg';
  deleteButton.appendChild(deleteButtonImg);

  [checkBox, label, editInput, editButton, deleteButton].forEach((element) => {
    listItem.appendChild(element);
  });
  return listItem;
};

const addTask = function () {
  if (!taskInput.value) return;
  const listItem = createNewTaskElement(taskInput.value);
  incompleteTaskHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
  taskInput.value = '';
};

const editTask = function () {
  const listItem = this.parentNode;
  const editInput = listItem.querySelector('input[type=text]');
  const label = listItem.querySelector('label');
  const editButton = listItem.querySelector('.edit');
  const containsClass = listItem.classList.contains('editMode');
  if (containsClass) {
    label.innerText = editInput.value;
    editButton.innerText = 'Edit';
  } else {
    editInput.value = label.innerText;
    editButton.innerText = 'Save';
  }
  listItem.classList.toggle('editMode');
};

const deleteTask = function () {
  const listItem = this.parentNode;
  const parentList = listItem.parentNode;
  parentList.removeChild(listItem);
};

function moveTask(targetList, nextHandler) {
  const listItem = this.parentNode;
  targetList.appendChild(listItem);
  bindTaskEvents(listItem, nextHandler);
}

const taskCompleted = function () {
  moveTask.call(this, completedTasksHolder, taskIncomplete);
};

const taskIncomplete = function () {
  moveTask.call(this, incompleteTaskHolder, taskCompleted);
};

addButton.addEventListener('click', addTask);

const bindTaskEvents = function (taskListItem, checkBoxEventHandler) {
  const checkBox = taskListItem.querySelector('input[type=checkbox]');
  const editButton = taskListItem.querySelector('button.edit');
  const deleteButton = taskListItem.querySelector('button.delete');

  editButton.addEventListener('click', editTask);
  deleteButton.addEventListener('click', deleteTask);
  checkBox.removeEventListener('change', taskCompleted);
  checkBox.removeEventListener('change', taskIncomplete);
  checkBox.addEventListener('change', checkBoxEventHandler);
};

function bindListItems(taskHolder, taskHandler) {
  for (let taskIndex = 0; taskIndex < taskHolder.children.length; taskIndex++) {
    bindTaskEvents(taskHolder.children[taskIndex], taskHandler);
  }
}

bindListItems(incompleteTaskHolder, taskCompleted);
bindListItems(completedTasksHolder, taskIncomplete);
