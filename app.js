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


// RENDER TASKS
function renderTasks() {


    //maybe should make it its own function?

    //check if task need to be rendered in certian order

    //puts a copy of tasks into displayed tasks
    let displayedTasks = tasks.slice();

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



//Sorting the tasks based on due date
document.querySelector(".dueDate").addEventListener("click", function()
{
    // we'll use 2 for due date 
    sortType = "DueDate";
    renderTasks();
});

document.querySelector(".priority").addEventListener("click", function(){

    //we'll use 3 for priority
    sortType = "Priority";
    renderTasks();
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
    
