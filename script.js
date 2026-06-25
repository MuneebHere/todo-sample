// ── Element references ──
const taskInput    = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const dueTimeInput = document.getElementById('dueTimeInput');
const addBtn       = document.getElementById('addBtn');
const taskList     = document.getElementById('taskList');
const emptyMsg     = document.getElementById('emptyMsg');
const clearAllBtn  = document.getElementById('clearAllBtn');

// ── Format the current date & time (used for "Created" stamp) ──
function formatNow() {
  const now = new Date();
  const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return date + ' at ' + time;
}

// ── Format a due date + optional due time picked by the user ──
// Returns null if no date was chosen.
function formatDue(dateStr, timeStr) {
  if (!dateStr) return null;

  // Appending 'T' + time avoids the UTC-midnight timezone shift issue
  const dt   = new Date(dateStr + 'T' + (timeStr || '00:00'));
  const date = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (!timeStr) return date;

  const time = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return date + ' at ' + time;
}

// ── Show/hide the empty message and clear-all button ──
function updateEmptyMessage() {
  const hasTasks = taskList.children.length > 0;
  emptyMsg.style.display    = hasTasks ? 'none'         : 'block';
  clearAllBtn.style.display = hasTasks ? 'inline-block' : 'none';
}

// ── Build one <li> task item ──
function createTaskItem(text, dueDate, dueTime) {
  const createdLabel = formatNow();
  const dueLabel     = formatDue(dueDate, dueTime);

  const li = document.createElement('li');
  li.className = 'task-item';

  // Checkbox — marks task as done
  const checkbox = document.createElement('input');
  checkbox.type  = 'checkbox';
  checkbox.addEventListener('change', function () {
    li.classList.toggle('done', checkbox.checked);
  });

  // Task body: holds the text + timestamps
  const taskBody = document.createElement('div');
  taskBody.className = 'task-body';

  // Task label
  const span = document.createElement('span');
  span.className   = 'task-text';
  span.textContent = text;

  // Metadata row
  const meta = document.createElement('div');
  meta.className = 'task-meta';

  const createdSpan = document.createElement('span');
  createdSpan.className   = 'meta-created';
  createdSpan.textContent = 'Created: ' + createdLabel;
  meta.appendChild(createdSpan);

  if (dueLabel) {
    const dueSpan = document.createElement('span');
    dueSpan.className   = 'meta-due';
    dueSpan.textContent = 'Due: ' + dueLabel;
    meta.appendChild(dueSpan);
  }

  taskBody.appendChild(span);
  taskBody.appendChild(meta);

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
  li.appendChild(taskBody);
  li.appendChild(deleteBtn);

  return li;
}

// ── Add a new task ──
function addTask() {
  const text = taskInput.value.trim();

  if (text === '') return; // ignore empty input

  taskList.appendChild(createTaskItem(text, dueDateInput.value, dueTimeInput.value));

  // Clear inputs
  taskInput.value    = '';
  dueDateInput.value = '';
  dueTimeInput.value = '';

  taskInput.focus(); // keep focus for quick entry
  updateEmptyMessage();
}

// ── Event listeners ──
addBtn.addEventListener('click', addTask);

clearAllBtn.addEventListener('click', function () {
  taskList.innerHTML = '';
  updateEmptyMessage();
});

taskInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') addTask();
});

// ── Init ──
updateEmptyMessage();
