const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const themeToggle = document.getElementById('theme-toggle');
const todoSummary = document.getElementById('todo-summary');
const filterBar = document.getElementById('filter-bar');
const progressFill = document.getElementById('progress-fill');
const todoCountEl = document.getElementById('todo-count');
const doneCountEl = document.getElementById('done-count');

let currentFilter = 'all';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

function getRealItems() {
  return Array.from(todoList.querySelectorAll('.todo-item'));
}

function updateSummary() {
  const items = getRealItems();
  const total = items.length;
  const done = items.filter(li => li.classList.contains('completed')).length;

  if (total === 0) {
    todoSummary.hidden = true;
    filterBar.hidden = true;
    return;
  }

  todoSummary.hidden = false;
  filterBar.hidden = false;

  todoCountEl.textContent = `共 ${total} 項`;
  doneCountEl.textContent = `已完成 ${done} 項`;
  progressFill.style.width = `${Math.round((done / total) * 100)}%`;
}

function applyFilter() {
  const items = getRealItems();
  items.forEach(li => {
    const isCompleted = li.classList.contains('completed');
    if (
      currentFilter === 'all' ||
      (currentFilter === 'active' && !isCompleted) ||
      (currentFilter === 'completed' && isCompleted)
    ) {
      li.style.display = '';
    } else {
      li.style.display = 'none';
    }
  });
}

filterBar.addEventListener('click', (event) => {
  const btn = event.target.closest('.filter-btn');
  if (!btn) return;
  filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = btn.dataset.filter;
  applyFilter();
});

function renderEmptyState() {
  if (getRealItems().length === 0) {
    todoList.innerHTML = '<li class="empty"><span class="empty-icon">📋</span>目前沒有待辦事項</li>';
  }
}

function addTodoItem(text) {
  const empty = todoList.querySelector('.empty');
  if (empty) {
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
    updateSummary();
    applyFilter();
  });

  const span = document.createElement('span');
  span.textContent = text;

  label.appendChild(checkbox);
  label.appendChild(span);

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-btn';
  deleteButton.setAttribute('aria-label', '刪除');
  deleteButton.textContent = '🗑';
  deleteButton.addEventListener('click', () => {
    li.classList.add('removing');
    li.addEventListener('animationend', () => {
      li.remove();
      renderEmptyState();
      updateSummary();
      applyFilter();
    }, { once: true });
  });

  li.appendChild(label);
  li.appendChild(deleteButton);
  todoList.appendChild(li);

  updateSummary();
  applyFilter();
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

