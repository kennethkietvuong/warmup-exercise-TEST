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
    taskDescription = document.createElement("h3");
    taskDescription.textContent = taskItem.task;
    taskDiv.setAttribute("task-id", taskItem.id);

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

    taskDiv.appendChild(taskDescription);
    taskDiv.appendChild(buttonContainer);

    //console.log(taskDiv.textContent);

    // If task "completed", then add class "completed" for appearance change
    if (taskItem.completed) {
        taskDiv.classList.add("completed");
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



/**
 * WARNING: This is still experimental! I do not have much knowledge on JS, so
 * this "somewhat" works but not really. I used ChatGPT and Gemini to give me
 * some guidance with the little knowledge I have.
 * 
 * Below is the functions that deal with editing task entries.
 */

// Function to edit a task
function editTask(divItem, taskId) {
    // const taskTitle = divItem.textContent.trim(); // get current title
    const taskTitle = divItem.querySelector("h3").textContent; // get current title
    
    // Create input text box to change task title
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = taskTitle;
    
    // Hide task title, edit/delete buttons
    divItem.querySelector("h3").style.display = "none";
    divItem.querySelector("div[class='buttons']").style.display = "none";

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

// FIXME:
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
    if (newTitle != taskTitle) {
        divItem.querySelector("h3").textContent = newTitle;
    } else {
        // handle case where user enters empty title on edit
        console.error("Task title cannot be empty!");
    }
    cancelEdit(divItem, taskTitle); // revert to original title
}

// DONE:
// Function to cancel editing a task
function cancelEdit(divItem, originalTitle) {
    // Unhides original task title & edit/delete buttons
    divItem.querySelector("h3").removeAttribute("style");
    divItem.querySelector("div[class='buttons']").removeAttribute("style");
    
    // Deletes the input text box & container that contains save/cancel button
    divItem.querySelector("input").remove();
    divItem.querySelector("div[class='edit-buttons']").remove();
}