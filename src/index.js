import "./styles.css";
import Display from "./dom.js";
import ProjectManager from "./projetManager.js";
import TaskManager from "./taskMangager.js";

const display = new Display();
const projectManager = new ProjectManager();
const taskManager = new TaskManager(projectManager);

const addProjectBtn = document.querySelector("#project-dialog + button");
const projectDialog = document.getElementById("project-dialog")
const projectDialogAddbtn = document.getElementById("add-btn-project");
let projectDialogInputTitle = document.getElementById("title-input-project");

const taskDialog = document.getElementById("task-dialog");
const taskDialogAddbtn = document.getElementById("add-btn-task");
let taskDialogInputTitle = document.getElementById("title-input-task");
let taskDialogInputDescription = document.getElementById("description-input-task");

let dialogMode = null;
let currentTaskId = null;
/* Lors de l'ajout d'un projet :
     - Ajouter le projet dans la sidebar.
     - Définir le nouveau projet créé comme projet actif. */

addProjectBtn.addEventListener("click", () => {
    openAndResetProjectDialog()
});

projectDialogAddbtn.addEventListener("click", () => {
        projectManager.add(projectDialogInputTitle.value);
        display.renderProjects(projectManager.projects, projectManager.activeProjectId);
        display.renderTasks(taskManager.getTasks(), projectManager.activeProjectId);
        projectDialog.close();
});

display.onDeleteProject = (id) => {
    projectManager.delete(id);
    
    display.renderProjects(projectManager.getAll(), null);
    display.renderTasks(taskManager.getTasks());
}

display.onSelectProject = (id) => {
    projectManager.setActiveProjectId(id);
    display.renderProjects(projectManager.getAll(), projectManager.getActiveProjectId());
    display.renderTasks(taskManager.getTasks());
}

display.onDeleteTask = (id) => {
    taskManager.delete(id);
    display.renderTasks(taskManager.getTasks());
}

display.onAddTask = () => {
    dialogMode = "add";

    taskDialogInputTitle.value = "";
    taskDialogInputDescription.value = "";

    taskDialogAddbtn.textContent = "Ajouter";
    taskDialog.showModal();
}

taskDialogAddbtn.addEventListener("click", () => {
    const data = getTaskDialogInput();

    if (dialogMode === "add") {
        taskManager.add(data.title, data.description);
    }

    if (dialogMode === "edit") {
        taskManager.update(currentTaskId, data);
    }
    closeAndResetTaskDialog();
    display.renderTasks(taskManager.getTasks(), projectManager.activeProjectId);
});

display.onEditTask = (id) => {
    const currentProject = projectManager.getActiveProject();
    console.log('currentProject :', currentProject)
    console.log('id :', id)
    console.log('currentProject[0].tasks.find(t => t.id == id :', currentProject[0].tasks.find(t => t.id == id))
    const task = currentProject[0].tasks.find(t => t.id == id);
    console.log('task.id :', task.id)
    dialogMode = "edit";
    currentTaskId = task.id
    console.log('currentTaskId : ', currentTaskId)

    taskDialogInputTitle.value = task.title;
    taskDialogInputDescription.value = task.description;

    taskDialogAddbtn.textContent = "Modifier";
    taskDialog.showModal();
}

function openAndResetProjectDialog() {
    projectDialogInputTitle.value = "";
    projectDialog.showModal();
}

function openAndResetTaskDialog() {
    taskDialogInputTitle.value = "";
    taskDialogInputDescription.value = "";
    taskDialog.showModal();
}

function closeAndResetTaskDialog() {
    // taskDialogInputTitle.value = "";
    // taskDialogInputDescription.value = "";
    taskDialog.close();
}

function getTaskDialogInput() {
    let data = {};
    data.title = taskDialogInputTitle.value
    data.description = taskDialogInputDescription.value
    return data;
}