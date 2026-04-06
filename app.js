// TASKS ARRAY DISPLAY

// Initial array declaration
const tasks = ["Wash car", "Visit mom", "Water plants", "Walk dog"];

// Selecting the container
const tasksContainer = document.getElementById("tasksContainer");

// Rendering function
function renderTasks(taskArray) {
    // Clear any old cards
    tasksContainer.innerHTML = "";
    // Loop through each card
    taskArray.forEach(task => {
        // Create a card and append it
        const card = document.createElement("div");
        card.className = "task-card";
        card.textContent = task;
        tasksContainer.appendChild(card);
    });
}

// Initial render (use the function again when updating the list i.e. the user adds, changes, or deletes a card)
renderTasks(tasks);