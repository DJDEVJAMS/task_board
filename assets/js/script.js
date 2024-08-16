// Retrieve tasks and nextId from localStorage, or initialize empty arrays if they don't exist
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Function to generate a unique task id
function generateTaskId() {
    const id = nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return id;
}

// Function to create a task card
function createTaskCard(task) {
    return `
    <div class="card mb-3" data-id="${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <p class="card-text"><small class="text-muted">Due: ${task.dueDate || 'No due date'}</small></p>
        <button class="btn btn-danger btn-sm delete-task">Delete</button>
      </div>
    </div>`;
}

// Function to render the task list and make cards draggable
function renderTaskList() {

    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();
  
    taskList.forEach(task => {
      const taskCard = createTaskCard(task);
      const statusId = task.status === 'to-do' ? 'todo-cards' : `${task.status}-cards`;
      $(`#${statusId}`).append(taskCard);
    });

  // Make tasks draggable
  $('.card').draggable({
    revert: "invalid", // Task reverts to original position if not dropped into a valid lane
    cursor: "move"
  });

  // Attach event listeners to delete buttons
  $('.delete-task').click(handleDeleteTask);
}

// Function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const title = $('#taskTitle').val();
    const description = $('#taskDescription').val();
    const status = $('#taskStatus').val();
    const dueDate = $('#taskDueDate').val();
  
    const task = {
      id: generateTaskId(),
      title: title,
      description: description,
      status: status,
      dueDate: dueDate
    };
  
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
  
    renderTaskList();
    $('#formModal').modal('hide'); // Close the modal  
}

// Function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(event.target).closest('.card').data('id');
    taskList = taskList.filter(task => task.id !== taskId);
  
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.helper.data('id');
    const newStatus = $(this).closest('.lane').attr('id');
  
    taskList.forEach(task => {
      if (task.id === taskId) {
        task.status = newStatus.replace('-cards', '');
      }
    });
  
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $('#taskForm').submit(handleAddTask);
  
    // Make lanes droppable
    $('.lane .card-body').droppable({
      accept: ".card",
      drop: handleDrop
    });
  
    // Initialize the date picker (optional)
    $('#taskDueDate').datepicker({
      dateFormat: "yy-mm-dd"
    });
  
    // Event delegation for delete buttons
    $(document).on('click', '.delete-task', handleDeleteTask);
});
