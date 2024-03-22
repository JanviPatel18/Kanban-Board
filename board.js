const todoList = document.getElementById('todo').querySelector('.task-list');
const inProgressList = document.getElementById('completed').querySelector('.task-list');


fetch('https://jsonplaceholder.typicode.com/todos')
  .then(response => response.json())
  .then(todos => {
    todos.forEach(todo => {
      const task = document.createElement('li');
      task.classList.add('task');
      task.setAttribute('draggable', 'true');
      task.setAttribute('id', `${todo.id}`);

      task.ondragstart = handleDragStart;
      task.ondragover = handleDragOver;
      task.ondrop = handleDrop;

      const taskName = document.createElement('span');
      taskName.classList.add('task-name');
      taskName.innerText = todo.title;

      const taskDetails = document.createElement('span');
      taskDetails.classList.add('task-details');
      taskDetails.innerText = `\n User ID: ${todo.userId}`;

      task.appendChild(taskName);
      task.appendChild(taskDetails);

      if (todo.completed) {
        inProgressList.appendChild(task);
      } else {
        todoList.appendChild(task);
      }
      console.log(todo);
    });
  });

  
  

  function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.dataTransfer.effectAllowed = 'move';
  
    event.target.classList.add('dragging');

    setTimeout(() => {
      event.target.classList.remove('dragging');
    }, 1000); 
  }
  

function handleDragOver(event) {
  event.preventDefault();
  if (event.dataTransfer.effectAllowed === 'move') {
    event.dataTransfer.dropEffect = 'move';
  }

  // Create or retrieve the placeholder div
  let placeholder = document.querySelector('.placeholder');
  if (!placeholder) {
    placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    document.body.appendChild(placeholder);
  }

  // Calculate the position of the placeholder
  const targetTask = event.target.closest('.task');
  const taskList = targetTask.parentElement;
  const rect = targetTask.getBoundingClientRect();
  const offsetY = event.clientY - rect.top;
  const placeholderIndex = Array.from(taskList.children).indexOf(targetTask) + (offsetY > rect.height / 2 ? 1 : 0);

  // Insert the placeholder into the correct position
  taskList.insertBefore(placeholder, taskList.children[placeholderIndex]);
}

function handleDrop(event) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData('text/plain');
  const draggedTask = document.getElementById(taskId);

  const targetContainer = event.currentTarget.closest('.kanban-list');

  if (targetContainer) {
    const taskList = targetContainer.querySelector('.task-list');
    const placeholder = document.querySelector('.placeholder');

    // Insert the dragged task after the placeholder
    taskList.insertBefore(draggedTask, placeholder);

    const taskTitle = draggedTask.querySelector('.task-name').innerText;
    const taskUserId = draggedTask.querySelector('.task-details').innerText.replace('\n User ID: ', '');
    console.log(`Task "${taskTitle}" ${taskUserId} moved to ${targetContainer.id}.`);
  } else {
    console.error('Target container not found.');
  }

  // Remove the placeholder
  const placeholder = document.querySelector('.placeholder');
  if (placeholder) {
    placeholder.remove();
  }
}




