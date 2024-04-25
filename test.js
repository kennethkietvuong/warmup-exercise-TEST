/**
 *  Note: the checkboxes do not have any current functionality when checked or unchecked
 */

// Variables based on HTML ID tags
const taskDivElement = document.getElementById("task-list");
const newTaskInput = document.getElementById("new-task");
const addTaskButton = document.getElementById("add-task");

// Function that loads JSON file for webpage to display task list
function loadTasks() {
    fetch('task-list/hard-coded-tasks.json')
        .then(response => response.json())
        .then(data => {
            //console.log(data);
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
    taskDiv.setAttribute("class", "taskItem");
    
    // Create header element for task title
    taskDescription = document.createElement("label"); //
    taskDescription.textContent = taskItem.task;

    
    // Create checkbox for task title
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.name = "acheckBox"
    checkBox.classList.add("checkbox");
    
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

    taskDiv.appendChild(checkBox);
    taskDiv.appendChild(taskDescription);
    taskDiv.appendChild(buttonContainer);

    // If task "completed", then add class "completed" for appearance change
    if (taskItem.completed) {
        taskDiv.classList.add("completed");
        checkBox.checked = true;
    }
    taskDivElement.appendChild(taskDiv);
}

// Function that adds a new task
function addNewTask(title) {
    // Update tasks data & re-render list
    fetch('task-list/hard-coded-tasks.json')
        .then(response => response.json())
        .then(data => {
            const newID = data.length + 1; // this is a bug!
            const newTask = {
                "id": newID,
                "task": title,
                "completed": false,
                "priority": "Low",     // filler
                "due": "filler date" // filler
            }
            
            data.push(newTask);
            localStorage.setItem("tasks", JSON.stringify(data));
            const divItem = renderTask(newTask);
            //taskDivElement.innerHTML = "";
            // loadTasks();
        });
}

// Function that deletes a task
function deleteTask(divItem, taskId) {
    fetch('task-list/hard-coded-tasks.json')
    .then(response => response.json())
        .then(data => {
            const updatedData = data.filter(task => task.id !== taskId);
            localStorage.setItem("tasks", JSON.stringify(updatedData));
            divItem.remove();
        });
}

loadTasks();

/** 
 * When user presses the "Add" button, it reads the new task and sends that
 * input to the addNewTask function
 */
addTaskButton.addEventListener("click", () => {
    const newTaskTitle = newTaskInput.value.trim();
    if (newTaskTitle) {
        addNewTask(newTaskTitle);
        newTaskTitle.value = "";
    }
});

// Function to edit a task
function editTask(divItem, taskId) {
    const taskTitle = divItem.querySelector("label").textContent; // get current title 
    
    // Create input text box to change task title
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = taskTitle;
    
    // Hide task title, edit/delete buttons
    divItem.querySelector("label").style.display = "none";
    divItem.querySelector("div[class='buttons']").style.display = "none";
    divItem.querySelector("input[type='checkbox']").style.display = "none";

    // Wrap buttons for better query targeting
    const buttonContainer = document.createElement("div");
    buttonContainer.setAttribute("class","edit-buttons"); 

    // Create a save button to save changes
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", () => saveEdit(divItem, taskId, editInput.value, taskTitle));

    // Create a cancel button to cancel changes
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", () => cancelEdit(divItem, taskTitle));

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);

    divItem.appendChild(editInput);
    divItem.appendChild(buttonContainer);
}

// Function to save edited task
function saveEdit(divItem, taskId, newTitle, taskTitle) {
    // if (newTitle.trim()) {
    //     fetch('task-list/hard-coded-tasks.json')
    //     .then(response => response.json())
    //     .then(data => {
    //         const updatedData = data.map(task => (task.id === taskId ? { ...task, title: newTitle } : task));
    //         localStorage.setItem("tasks", JSON.stringify(updatedData)); // update local storage
    //         divItem.textContent = newTitle; // update displayed title
    //         removeEditElements(divItem); // remove edit UI elements
    //     });
    if (newTitle != taskTitle && newTitle.length != 0) {
        divItem.querySelector("label").textContent = newTitle;
    }
    cancelEdit(divItem, taskTitle); // revert to original title
}

// Function to cancel editing a task
function cancelEdit(divItem, originalTitle) {
    // Unhides original task title & edit/delete buttons
    divItem.querySelector("label").removeAttribute("style");
    divItem.querySelector("div[class='buttons']").removeAttribute("style");
    divItem.querySelector("input[type='checkbox']").removeAttribute("style");
    
    // Deletes the input text box & container that contains save/cancel button
    divItem.querySelector("input[type='text']").remove();
    divItem.querySelector("div[class='edit-buttons']").remove();
}