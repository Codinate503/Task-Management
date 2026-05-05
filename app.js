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


//used to indicate the type of sorting that occurs
let sortType = "";

let searchQuery = "";

let showCompletedTasks = true;


// --- Statistics dashboard ---

// value which decides which page to render
    // can be changed by clicking the statistics button and the home button
let currentView = "home";

// renderView function which deicdes which page to render depending on currentView
function renderView() {
    if (currentView === "home") {
        renderTasks();
    } else if (currentView === "stats") {
        renderStats();
    }
}

// switch views
document.getElementById("homeBtn").addEventListener("click", () => {
    currentView = "home";
    renderView();
});

document.getElementById("statsBtn").addEventListener("click", () => {
    currentView = "stats";
    renderView();
});

// render stats
function renderStats() {
    tasksContainer.innerHTML = "";

    let total = tasks.length;
    let completed = tasks.filter(t => t.completed).length;
    let today = new Date().toISOString().split("T")[0];
    
    let overdue = tasks.filter(t => {
        if (!t.dueDate) return false;
        return t.dueDate < today && !t.completed;
    }).length;

    let dueToday = tasks.filter(t =>
        t.dueDate === today && !t.completed
    ).length;

    let percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    const statsHTML = `
        <div class="stats-page">

            <div class="stats-bars">

                <div class="bar-group">
                    <h3>Total Tasks</h3>
                    <div class="task-bar">
                        ${tasks.map(() => `<div class="block total"></div>`).join("")}
                    </div>
                </div>

                <div class="bar-group">
                    <h3>Completed</h3>
                    <div class="task-bar">
                        ${tasks.map((_, i) => `
                            <div class="block ${i < completed ? "completed" : "empty"}"></div>
                        `).join("")}
                    </div>
                </div>
                        
                <div class="bar-group">
                    <h3>Due Today</h3>
                    <div class="task-bar">
                        ${tasks.map((_, i) => `
                            <div class="block ${i < dueToday ? "dueToday" : "empty"}"></div>
                        `).join("")}
                    </div>
                </div>

                <div class="bar-group">
                    <h3>Overdue</h3>
                    <div class="task-bar">
                        ${tasks.map((_, i) => `
                            <div class="block ${i < overdue ? "overdue" : "empty"}"></div>
                        `).join("")}
                    </div>
                </div>
                
            </div>
        </div>
    `;

    tasksContainer.innerHTML = statsHTML;
}

// render tasks
function renderTasks() {


    //maybe should make it its own function?

    //check if task need to be rendered in certian order

    //puts a copy of tasks into displayed tasks
    let displayedTasks = tasks.slice();

    // Filter by search query
    if (searchQuery) {
        displayedTasks = displayedTasks.filter(task =>
            task.title.toLowerCase().includes(searchQuery) ||
            task.description.toLowerCase().includes(searchQuery)
        );
    }

    let priorityLevel =
        {
            High: 1,
            Medium: 2,
            Low: 3
        };

    if(sortType === "DueDate")
    {   
        displayedTasks.sort((a, b) => {
            //sends empty dates to the bottom of the list because they have no date 

            //negative numbers means that A was smaller so B will go first  
            if(a.dueDate === "")
            {
                return 1;
            }
            if(b.dueDate === "") 
            {
                return -1;
            }
            //changing dates from string to numberical date format
            let dateA = new Date(a.dueDate);
            let dateB = new Date(b.dueDate);
            
            return dateA - dateB;
        });
    }
    
    else if(sortType === "Priority")
    {
       displayedTasks.sort((a, b) => priorityLevel[a.priority] - priorityLevel[b.priority]);
    }
    //another if statement for if task is completed and "hide completed" is on in filter menu
    //displaying the tasks based on completion status
    if(!showCompletedTasks)
    {
        displayedTasks = displayedTasks.filter(task => task.completed === false);
    }



    tasksContainer.innerHTML = "";

    displayedTasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "task-card";

        if (task.completed) {
            card.classList.add("completed");
        }

        card.innerHTML = `
            <div class="task-row">
                <div class="buttonAndName">
                    <button class="complete-btn">
                        
                    </button>
                    <h3 class="priority-${task.priority.toLowerCase()}">
                        ${task.title}
                    </h3>
                </div>
                <span class="due-date">
                    ${task.dueDate ? formatDate(task.dueDate) : "No Date"}
                </span>
            </div>

        `;  

        // <input class="complete-btn" type="checkbox">

        // <button class="complete-btn">
        //         ${task.completed ? "Undo" : "Complete"} 
        // </button>


        // COMPLETE
        const completeBtn = card.querySelector(".complete-btn");        

        completeBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            toggleComplete(task.id);

        });

        // adds check mark if the task is completed 
        if(task.completed)
        {
            completeBtn.innerHTML = "<img src='icons/check.png' class='check'>";
        }


        // CLICK = OPEN POPUP
        card.addEventListener("click", () => openPopup(task.id));

        tasksContainer.appendChild(card);
    });
}

// DATE CONVERSION INTO MM/DD
function formatDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
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

    renderView();
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
    renderView();
};

document.getElementById("deleteBtn").onclick = function () {
    tasks = tasks.filter(t => t.id !== currentTaskId);
    closePopup();
    renderView();
};

document.getElementById("cancelBtn").onclick = closePopup;

// COMPLETE TASK
function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    renderView();
}

// ADD BUTTON
document.querySelector(".sidebarIcons:last-child").addEventListener("click", addTask);

renderView();


// SORTING & FILTERING TASKS
    //Sorting the tasks based on due date
    document.querySelector(".dueDate").addEventListener("click", function()
    {
        // we'll use "DueDate" for due date 
        sortType = "DueDate";
        renderView();
    });
    //Sorting the tasks based on priority
    document.querySelector(".priority").addEventListener("click", function(){

        //we'll use "Priority" for priority
        sortType = "Priority";
        renderView();
    });
    //Activates if the 'hide completed' checkbox is checked/unchecked
    document.querySelector("#HideComp").addEventListener("change", function(){

        //checks the status of the box and sets vaibale accrodingly for the renderview function
        if (this.checked)
        {
            showCompletedTasks = false;
        }
        else
        {
            showCompletedTasks = true;
        }
        renderView();
    });
    



//Adding Custiom Profile Pic

let profilePic = document.querySelector("#profilePic");

let inputFile = document.querySelector("#userPhoto");

inputFile.addEventListener("change", function()
{
    if(inputFile.files.length > 0)
    {
        profilePic.src = URL.createObjectURL(inputFile.files[0]);
    }
    

});
    
// SEARCH FUNCTIONALITY
const searchToggle = document.getElementById("searchToggle");
const searchBar = document.getElementById("searchBar");
const searchInput = document.getElementById("searchInput");

// TOGGLE OPEN/CLOSED
searchToggle.addEventListener("click", () => {
    searchBar.classList.toggle("open");
    if (searchBar.classList.contains("open")) {
        searchInput.focus();
    } else {
        searchInput.value = "";
        searchQuery = "";
        renderView();
    }
});

// FILTER AS USER TYPES
searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    renderView();
});

// CLOSE
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        searchBar.classList.remove("open");
        searchInput.value = "";
        searchQuery = "";
        renderView();
    }
});
