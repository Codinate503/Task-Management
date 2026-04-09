// TASK DATA
let tasks = [
    { id: 1, title: "Wash car", description: "", dueDate: "", priority: "Low", completed: false },
    { id: 2, title: "Visit mom", description: "", dueDate: "", priority: "Medium", completed: false },
    { id: 3, title: "Water plants", description: "", dueDate: "", priority: "Low", completed: false },
    { id: 4, title: "Walk dog", description: "", dueDate: "", priority: "High", completed: false }
];

let taskIdCounter = 5;
let currentTaskId = null;

const tasksContainer = document.getElementById("tasksContainer");
const overlay = document.getElementById("popupOverlay");

// RENDER TASKS
function renderTasks() {
    tasksContainer.innerHTML = "";

    tasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "task-card";

        if (task.completed) card.classList.add("completed");

        card.innerHTML = `
            <div class="task-row">
                <h3 class="priority-${task.priority.toLowerCase()}">
                    ${task.title}
                </h3>
                <span class="due-date">
                    ${task.dueDate ? formatDate(task.dueDate) : "No Date"}
                </span>
            </div>
        `;

        // CLICK = OPEN POPUP
        card.addEventListener("click", () => openPopup(task.id));

        tasksContainer.appendChild(card);
    });
}

// DATE CONVERSION INTO MM/DD
function formatDate(dateString) {
    const date = new Date(dateString);

    const month = date.getMonth() + 1; // months start at 0
    const day = date.getDate();

    return `${month}/${day}`;
}

// CREATE TASK
function addTask() {
    tasks.push({
        id: taskIdCounter++,
        title: "New Task",
        description: "",
        dueDate: "",
        priority: "Low",
        completed: false
    });

    renderTasks();
}

// POPUP LOGIC
function openPopup(id) {
    const task = tasks.find(t => t.id === id);
    currentTaskId = id;

    document.getElementById("editTitle").value = task.title;
    document.getElementById("editDescription").value = task.description;
    document.getElementById("editDate").value = task.dueDate;
    document.getElementById("editPriority").value = task.priority;

    overlay.style.display = "flex";
}

function closePopup() {
    overlay.style.display = "none";
}

// SAVE / DELETE / CANCEL
document.getElementById("saveBtn").onclick = function () {
    const task = tasks.find(t => t.id === currentTaskId);

    task.title = document.getElementById("editTitle").value;
    task.description = document.getElementById("editDescription").value;
    task.dueDate = document.getElementById("editDate").value;
    task.priority = document.getElementById("editPriority").value;

    closePopup();
    renderTasks();
};

document.getElementById("deleteBtn").onclick = function () {
    tasks = tasks.filter(t => t.id !== currentTaskId);
    closePopup();
    renderTasks();
};

document.getElementById("cancelBtn").onclick = closePopup;

// COMPLETE TASK
function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    renderTasks();
}

// ADD BUTTON
document.querySelector(".sidebarIcons:last-child").addEventListener("click", addTask);

renderTasks();
