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
    var randomIndex = Math.floor(Math.random() * 10);
    var randomNumberString = randomIndex.toString();
    while (randomNumberString.length < 3) {
        randomNumberString = '0' + randomNumberString;
    }
    return "/UI_src/imgs/pokemon/pokemon_icon_" + randomNumberString + "_00.png";
}

function displayRandomImage() {
    var randomImageUrl = getRandomImageUrl();
    var imageElement = document.getElementById("random-image");
    imageElement.src = randomImageUrl;
}

// Call the function to display tasks when the page loads
displayTasks();
displayRandomImage()