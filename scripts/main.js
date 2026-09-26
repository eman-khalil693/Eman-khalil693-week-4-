/* =========================================
   WEEK 4 - TASK MANAGEMENT APPLICATION
   Main JavaScript File
   ========================================= */


/* ---------- Get HTML Elements ---------- */

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const errorMessage = document.getElementById("errorMessage");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const filterButtons = document.querySelectorAll(".filter-btn");


/* ---------- Local Storage Key ---------- */

const STORAGE_KEY = "week4_tasks";


/* ---------- Application Data ---------- */

let tasks = [];
let currentFilter = "all";


/* ---------- Load Tasks From Local Storage ---------- */

function loadTasks() {

    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (savedTasks) {
        try {
            tasks = JSON.parse(savedTasks);
        } catch (error) {
            tasks = [];
        }
    } else {
        tasks = [];
    }

}


/* ---------- Save Tasks To Local Storage ---------- */

function saveTasks() {

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

}


/* ---------- Generate Unique Task ID ---------- */

function generateId() {

    return Date.now().toString() + Math.random().toString(16).slice(2);

}


/* ---------- Display Tasks ---------- */

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    /* Apply Filter */

    if (currentFilter === "active") {

        filteredTasks = tasks.filter(function(task) {
            return !task.completed;
        });

    } else if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function(task) {
            return task.completed;
        });

    }


    /* Show Empty Message */

    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

        if (currentFilter === "all") {
            emptyMessage.textContent = "No tasks yet. Add your first task!";
        } else if (currentFilter === "active") {
            emptyMessage.textContent = "No active tasks.";
        } else {
            emptyMessage.textContent = "No completed tasks.";
        }

        return;

    }


    emptyMessage.style.display = "none";


    /* Create Task Elements */

    filteredTasks.forEach(function(task) {

        const listItem = document.createElement("li");

        listItem.className = "task-item";

        if (task.completed) {
            listItem.classList.add("completed");
        }


        /* Task Content */

        const taskContent = document.createElement("div");

        taskContent.className = "task-content";


        /* Checkbox */

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "task-checkbox";

        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {
            toggleTask(task.id);
        });


        /* Task Text */

        const taskText = document.createElement("span");

        taskText.className = "task-text";

        taskText.textContent = task.text;


        /* Add checkbox and text */

        taskContent.appendChild(checkbox);

        taskContent.appendChild(taskText);


        /* Task Actions */

        const taskActions = document.createElement("div");

        taskActions.className = "task-actions";


        /* Edit Button */

        const editButton = document.createElement("button");

        editButton.type = "button";

        editButton.className = "task-btn edit-btn";

        editButton.textContent = "Edit";

        editButton.addEventListener("click", function() {
            editTask(task.id);
        });


        /* Delete Button */

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.className = "task-btn delete-btn";

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
        });


        /* Add Buttons */

        taskActions.appendChild(editButton);

        taskActions.appendChild(deleteButton);


        /* Add Everything To List Item */

        listItem.appendChild(taskContent);

        listItem.appendChild(taskActions);

        taskList.appendChild(listItem);

    });

}


/* ---------- Add New Task ---------- */

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const taskText = taskInput.value.trim();


    /* Validation */

    if (taskText === "") {

        errorMessage.textContent = "Please enter a task.";

        taskInput.focus();

        return;

    }


    if (taskText.length < 2) {

        errorMessage.textContent = "Task must contain at least 2 characters.";

        taskInput.focus();

        return;

    }


    /* Clear Error */

    errorMessage.textContent = "";


    /* Create New Task */

    const newTask = {

        id: generateId(),

        text: taskText,

        completed: false

    };


    /* Add Task */

    tasks.push(newTask);


    /* Save Task */

    saveTasks();


    /* Update Screen */

    renderTasks();


    /* Clear Input */

    taskInput.value = "";

    taskInput.focus();

});


/* ---------- Edit Task ---------- */

function editTask(taskId) {

    const task = tasks.find(function(item) {
        return item.id === taskId;
    });


    if (!task) {
        return;
    }


    const updatedText = prompt("Edit your task:", task.text);


    if (updatedText === null) {
        return;
    }


    const cleanText = updatedText.trim();


    if (cleanText === "") {

        alert("Task cannot be empty.");

        return;

    }


    if (cleanText.length < 2) {

        alert("Task must contain at least 2 characters.");

        return;

    }


    /* Update Task */

    task.text = cleanText;


    /* Save Changes */

    saveTasks();


    /* Update Screen */

    renderTasks();

}


/* ---------- Delete Task ---------- */

function deleteTask(taskId) {

    const taskIndex = tasks.findIndex(function(item) {
        return item.id === taskId;
    });


    if (taskIndex === -1) {
        return;
    }


    const confirmDelete = confirm("Are you sure you want to delete this task?");


    if (!confirmDelete) {
        return;
    }


    /* Remove Task */

    tasks.splice(taskIndex, 1);


    /* Save Changes */

    saveTasks();


    /* Update Screen */

    renderTasks();

}


/* ---------- Mark Task Complete / Active ---------- */

function toggleTask(taskId) {

    const task = tasks.find(function(item) {
        return item.id === taskId;
    });


    if (!task) {
        return;
    }


    task.completed = !task.completed;


    /* Save Changes */

    saveTasks();


    /* Update Screen */

    renderTasks();

}


/* ---------- Filter Tasks ---------- */

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        /* Remove active class */

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });


        /* Add active class to clicked button */

        button.classList.add("active");


        /* Set Current Filter */

        currentFilter = button.dataset.filter;


        /* Display Filtered Tasks */

        renderTasks();

    });

});


/* ---------- Clear Error While Typing ---------- */

taskInput.addEventListener("input", function() {

    if (taskInput.value.trim() !== "") {
        errorMessage.textContent = "";
    }

});


/* ---------- Start Application ---------- */

loadTasks();

renderTasks();
