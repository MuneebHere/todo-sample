// ── Element references ──
const taskInput = document.getElementById('taskInput');
const addBtn    = document.getElementById('addBtn');
const taskList  = document.getElementById('taskList');
const emptyMsg  = document.getElementById('emptyMsg');

// ── Show/hide the empty message ──
function updateEmptyMessage() {
  emptyMsg.style.display = taskList.children.length === 0 ? 'block' : 'none';
}

// ── Build one <li> task item ──
function createTaskItem(text) {
  const li = document.createElement('li');
  li.className = 'task-item';

  // Checkbox — marks task as done
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.addEventListener('change', function () {
    li.classList.toggle('done', checkbox.checked);
  });

  // Task label
  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = text;

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '✕';
  deleteBtn.setAttribute('aria-label', 'Delete task');
  deleteBtn.addEventListener('click', function () {
    li.remove();
    updateEmptyMessage();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

// ── Add a new task ──
function addTask() {
  const text = taskInput.value.trim();

  if (text === '') return; // ignore empty input

  taskList.appendChild(createTaskItem(text));
  taskInput.value = '';   // clear the input
  taskInput.focus();      // keep focus for quick entry
  updateEmptyMessage();
}

// ── Event listeners ──
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') addTask();
});

// ── Init ──
updateEmptyMessage();
