// ============================================================
//  GETTING IMPORTANT DOM ELEMENTS
// ============================================================
const myInput = document.getElementById("taskInput");
const submitButton = document.getElementById("submitButton");
const taskContainer = document.getElementById("taskContainer");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("task-counter");

// Array that will store all tasks
let myTasks = [];


// ============================================================
//  INITIALIZATION FUNCTION
//  Loads saved tasks and sets up event listeners
// ============================================================
const init = () => {
    loadTasks();
    renderTasks();
    submitButton.addEventListener("click", addTask);
};


// ============================================================
//  LOAD TASKS FROM LOCAL STORAGE
// ============================================================
function loadTasks() {
    const data = localStorage.getItem("_allTasks_");
    if (data) {
        myTasks = JSON.parse(data);  // convert string → array
    }
}


// ============================================================
//  SAVE TASKS BACK TO LOCAL STORAGE
// ============================================================
function saveTasks() {
    localStorage.setItem("_allTasks_", JSON.stringify(myTasks));
}


// ============================================================
//  ADDING A NEW TASK
// ============================================================
function addTask() {
    const taskText = myInput.value.trim();
    if (!taskText) return; // Prevent adding empty task

    myTasks.push(taskText);    // store in array
    saveTasks();               // save to localStorage
    renderTasks();             // update UI
    myInput.value = "";        // clear input
}


// ============================================================
//  DELETE A TASK
// ============================================================
function deleteTask(index) {
    myTasks.splice(index, 1);  // remove the task
    saveTasks();
    renderTasks();
}


// ============================================================
//  EDIT TASK - Convert span → input and Edit → Save
// ============================================================
function editTask(index, liElement) {

    const currentText = myTasks[index];

    const input = document.createElement("input");
    input.classList.add("edit-box");
    input.type = "text";
    input.value = currentText;

    // ⭐ ADD ENTER KEY SUPPORT ⭐
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const newValue = input.value.trim();
            if (newValue !== "") {
                myTasks[index] = newValue;
                saveTasks();
                renderTasks();
            }
        }
    });

    const oldSpan = liElement.querySelector("span");
    liElement.replaceChild(input, oldSpan);

    const editBtn = liElement.querySelector(".edit-btn");
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.classList.add("save-btn");

    saveBtn.addEventListener("click", () => {
        const newValue = input.value.trim();
        if (newValue !== "") {
            myTasks[index] = newValue;
            saveTasks();
            renderTasks();
        }
    });

    editBtn.replaceWith(saveBtn);
}



// ============================================================
//  RENDER ALL TASKS ON SCREEN
// ============================================================
function renderTasks() {
    taskList.innerHTML = ""; // clear the list

    myTasks.forEach((text, index) => {

        const li = document.createElement("li");

        // ----------- TASK TEXT (SPAN) -----------
        const textSpan = document.createElement("span");
        textSpan.textContent = text;
        li.appendChild(textSpan);

        // ----------- BUTTON GROUP WRAPPER -----------
        const buttonGroup = document.createElement("div");
        buttonGroup.classList.add("buttonGroup");

        // ----------- DELETE BUTTON -----------
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => deleteTask(index));

        const deleteIcon = document.createElement("img");
        deleteIcon.src = "images/delete-button.png";
        deleteIcon.alt = "Delete";
        deleteIcon.classList.add("delete-icon");

        deleteBtn.appendChild(deleteIcon);


        // ----------- EDIT BUTTON -----------
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");

        const editIcon = document.createElement("img");
        editIcon.src = "images/icons-edit.png";
        editIcon.alt = "Edit";
        editIcon.classList.add("edit-icon");

        editBtn.appendChild(editIcon);

        // edit button event listener
        editBtn.addEventListener("click", () => {
            editTask(index, li);
        });

        // Add both buttons into the group
        buttonGroup.appendChild(deleteBtn);
        buttonGroup.appendChild(editBtn);

        // Add the button group to the li
        li.appendChild(buttonGroup);

        // Finally add li to the main UL
        taskList.appendChild(li);
    });

    if (myTasks.length === 0){
        taskCounter.textContent = "No tasks yet..";
    }
    else{
        taskCounter.textContent = myTasks.length;
    }


    // Hide task container if no tasks exist
    taskContainer.style.display = myTasks.length ? "block" : "none";
}


init();  // start everything
