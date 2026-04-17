const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

function renderEmptyState() {
  if (todoList.children.length === 0) {
    todoList.innerHTML = '<li class="empty">目前沒有待辦事項</li>';
  }
}

function addTodoItem(text) {
  if (todoList.querySelector('.empty')) {
    todoList.innerHTML = '';
  }

  const li = document.createElement('li');
  li.className = 'todo-item';

  const label = document.createElement('label');
  label.className = 'todo-content';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.addEventListener('change', () => {
    li.classList.toggle('completed', checkbox.checked);
  });

  const span = document.createElement('span');
  span.textContent = text;

  label.appendChild(checkbox);
  label.appendChild(span);

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-btn';
  deleteButton.textContent = '刪除';
  deleteButton.addEventListener('click', () => {
    li.remove();
    renderEmptyState();
  });

  li.appendChild(label);
  li.appendChild(deleteButton);
  todoList.appendChild(li);
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();
  if (!text) {
    todoInput.focus();
    return;
  }

  addTodoItem(text);
  todoInput.value = '';
  todoInput.focus();
});

renderEmptyState();
