
/**
 *  Note: the checkboxes do not have any current functionality when checked or unchecked
 */

// Variables based on HTML ID tags
const taskList = document.getElementById("task_list_items");
const newTaskInput = document.getElementById("new-task");
const addTaskButton = document.getElementById("add-task");

// Function that loads JSON file for webpage to display task list
function loadTasks() {
    fetch('task-list/hard-coded-tasks.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(task => {
                renderTask(task);
            });
        });
}

// Main function that "renders" or displays task list from JSON file
function renderTask(taskItem) {
    // Create a div element for each task
    const taskDiv = document.createElement("div");
    taskDiv.setAttribute("task-id", taskItem.id);
    taskDiv.classList.add("task");
    taskDiv.setAttribute("pokemon-number", randomNumberGenerator());
    
    // Create checkbox (NEW)
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = taskItem.completed;
    checkbox.classList.add("task-checkbox");
    //checkbox.onchange = () => updateTaskCompletion(taskItem.id, checkbox.checked);
    
    // Create header element for task title
    const taskDescription = document.createElement("span");
    taskDescription.textContent = taskItem.task;
    taskDescription.style.fontWeight = "bold";
    taskDescription.setAttribute("name", "taskDescription");

    // Create due date for task item
    const dueDate = document.createElement("span");
    dueDate.textContent = ` Due: ${new Date(taskItem.due).toLocaleString()}`;
    dueDate.setAttribute("name", "dueDate");
    
    // Create a "container" to hold edit/delete button
    const buttonContainer = document.createElement("div");
    buttonContainer.setAttribute("class","buttons");

    // Create a edit button element for each task 
    const editButton = document.createElement("button");
    editButton.setAttribute("class", "edit-button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editTask(taskDiv, taskItem.id));

    // Create a delete button for each task
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "delete-button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteTask(taskDiv, taskItem.id));

    // Put edit & delete button into "container"
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskDescription);
    taskDiv.appendChild(dueDate);
    taskDiv.appendChild(buttonContainer);

    taskList.appendChild(taskDiv);
}

// // Function that adds a new task
// function addNewTask(title) {
//     // Update tasks data & re-render list
//     fetch('task-list/hard-coded-tasks.json')
//         .then(response => response.json())
//         .then(data => {
//             const newID = data.length + 1; // this is a bug!
//             const newTask = {
//                 "id": newID,
//                 "task": title,
//                 "completed": false,
//                 "priority": "Low",     // filler
//                 "due": "filler date" // filler
//             }

//             const divItem = renderTask(newTask);
//             //taskDivElement.innerHTML = "";
//             // loadTasks();
//         });
// }

// Function that deletes a task
function deleteTask(divItem, taskId) {
    fetch('task-list/hard-coded-tasks.json')
    .then(response => response.json())
        .then(data => {
            divItem.remove();
        });
}

// // Function to edit a task
function editTask(divItem, taskId) {
    // Get current task title/description
    const taskTitle = divItem.querySelector("span[name='taskDescription']").textContent;
    
    // Create input text box to change task title
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = taskTitle;

    // Save due date & current date
    const dueDate = divItem.querySelector("span[name='dueDate']").textContent;
    var currentDueDate = new Date(dueDate.replace(' Due: ', ''));

    // Date Dropdown
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = currentDueDate.toISOString().split('T')[0];
    const originalDate = dateInput.value;

    // Time
    const timeInput = document.createElement("input");
    timeInput.type = "time";
    timeInput.value = currentDueDate.toTimeString().substring(0,5);
    const originalTime = timeInput.value;

    // Hide task title, edit/delete buttons
    divItem.querySelector("span[name='taskDescription']").style.display = "none";
    divItem.querySelector("span[name='dueDate']").style.display = "none";
    divItem.querySelector("div[class='buttons']").style.display = "none";
    divItem.querySelector("input[type='checkbox']").style.display = "none";
    
    // Wrap buttons for better query targeting
    const buttonContainer = document.createElement("div");
    buttonContainer.setAttribute("class","edit-buttons"); 
    
    // Create a save button to save changes
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", () => saveEdit(divItem, taskId, editInput.value, taskTitle, 
        dateInput.value, originalDate, timeInput.value, originalTime));

    // Create a cancel button to cancel changes
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", () => cancelEdit(divItem, taskTitle));
    
    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);

    divItem.appendChild(editInput);
    divItem.appendChild(dateInput);
    divItem.appendChild(timeInput);
    divItem.appendChild(buttonContainer);
}

// // Function to save edited task
function saveEdit(divItem, taskId, newTitle, taskTitle, newDate, originalDate, newTime, originalTime) {
    let flag = false;
    let flag2 = false;
    var dateObj = new Date(newDate);
    
    if (newTitle != taskTitle && newTitle.length != 0) {
        divItem.querySelector("span[name='taskDescription']").textContent = newTitle;
    }

    if (newDate != originalDate) {
        flag = true;
    }
    if(newTime != originalTime) {
        flag2 = true;
    }

    if (flag || flag2) {
        if (flag) {
            dateObj.setDate(dateObj.getDate() + 1);   
        }
        if (flag2) {
            var time = newTime.split(":")
            dateObj.setHours(time[0], time[1]);
        }
        else {
            var time = originalTime.split(":");
            dateObj.setHours(time[0], time[1]);
        }

        divItem.querySelector("span[name='dueDate']").textContent = ` Due: ${dateObj.toLocaleString()}`;
    }
    cancelEdit(divItem, taskTitle); // revert to original title
}

// // Function to cancel editing a task
function cancelEdit(divItem, originalTitle) {
    // Unhides original task title, date, and edit/delete buttons
    divItem.querySelector("span[name='taskDescription']").removeAttribute("style");
    divItem.querySelector("span[name='taskDescription']").style.fontWeight = "bold";
    divItem.querySelector("span[name='dueDate']").removeAttribute("style");
    divItem.querySelector("div[class='buttons']").removeAttribute("style");
    divItem.querySelector("input[type='checkbox']").removeAttribute("style");
    
    // Deletes the input text box & container that contains save/cancel button
    divItem.querySelector("input[type='text']").remove();
    divItem.querySelector("div[class='edit-buttons']").remove();
    divItem.querySelector("input[type='date']").remove();
    divItem.querySelector("input[type='time']").remove();
}

function randomNumberGenerator () {
    var numPokemon = 80;
    var randomIndex = Math.floor(Math.random() * numPokemon)+1;
    var randomNumberString = randomIndex.toString();
    return randomNumberString;
}

// /** 
//  * When user presses the "Add" button, it reads the new task and sends that
//  * input to the addNewTask function
//  */
// addTaskButton.addEventListener("click", () => {
//     const newTaskTitle = newTaskInput.value.trim();
//     if (newTaskTitle) {
//         addNewTask(newTaskTitle);
//         newTaskTitle.value = "";
//     }
// });

loadTasks();

// Function to fetch and display tasks from JSON
function displayTasks() {
    fetch('task-list/hard-coded-tasks.json')
        .then(response => response.json())
        .then(tasks => {
            const taskWidget = document.getElementById('taskWidget');
            tasks.forEach(task => {
                const taskDiv = document.createElement('div');
                taskDiv.classList.add('task');

                taskDiv.innerHTML = `
                    <div class="task-id">Task ID: ${task.id}</div>
                    <div>Task: ${task.task}</div>
                    <div class="task-completed">Completed: ${task.completed ? 'Yes' : 'No'}</div>
                    <div class="task-priority">Priority: ${task.priority}</div>
                    <div>Due: ${task.due}</div>
                `;
                taskWidget.appendChild(taskDiv);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}

function getRandomImageUrl() {
    var numPokemon = 80;
    var randomIndex = Math.floor(Math.random() * numPokemon)+1;
    var randomNumberString = randomIndex.toString();
    while (randomNumberString.length < 3) {
        randomNumberString = '0' + randomNumberString;
    }
    return "UI_src/imgs/pokemon/pokemon_icon_" + randomNumberString + "_00.png";
}

function displayRandomImage() {
    for (var i = 1; i < 5; i++) {
        var randomImageUrl = getRandomImageUrl();
        var imageElement = document.getElementById("random-image" + i);
        imageElement.src = randomImageUrl;
        imageElement.alt = randomImageUrl;
    }
}

// Call the function to display tasks when the page loads
displayTasks();
displayRandomImage()
