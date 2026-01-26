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

/* Lors de l'ajout d'un projet :
     - Ajouter le projet dans la sidebar.
     - Définir le nouveau projet créé comme projet actif. */

addProjectBtn.addEventListener("click", () => {
    projectDialog.showModal();
});

projectDialogAddbtn.addEventListener("click", () => {
        projectManager.add(projectDialogInputTitle.value);
        
        projectDialogInputTitle.value = "";
        display.renderProjects(projectManager.projects, projectManager.activeProjectId);
        projectDialog.close();
});

addProjectBtn.addEventListener("click", () => {
    projectDialog.showModal();
});


/* Lors de l'ajout d'une tâche :
     - Ajouter la tâche dans le projet actif.
     - Afficher toutes les tâches du projet actif. */


/* - Le callback onDeleteProject est appelé en clickant sur le bouton delete d'un projet.
     Le callback permet de récupéré l'id du projet associé via le DOM et de le passer à la
     fonction delete() du projectManager.
   - Nous réaffichons ensuite toutes les projets dans la sidebar. */
display.onDeleteProject = (id) => {
    projectManager.delete(id);
    
    display.renderProjects(projectManager.getAll(), null);
    display.renderTasks(taskManager.getTasks());
}

/*  Le callback onActiveProject est appelé en clickant sur un projet
    Le callback permet de passer le projet clické dans l'état actif. */
display.onSelectProject = (id) => {
    projectManager.setActiveProjectId(id);
    display.renderProjects(projectManager.getAll(), projectManager.getActiveProjectId());
    display.renderTasks(taskManager.getTasks());
}

/*  Le callback onDeleteTask est appelé en clickant sur le bouton delete d'une tâche.
    Le callback permet de récupéré l'id de la tâche associé via le DOM et de le passer à la
    fonction delete() du taskManager. 
    Nous réaffichons ensuite toutes les tâches du projet actif. */
display.onDeleteTask = (id) => {
    taskManager.delete(id);
    display.renderTasks(taskManager.getTasks());
}

display.onAddTask = () => {
    taskDialog.showModal();
}

if (!taskDialog.classList.contains('edit')) {
taskDialogAddbtn.addEventListener("click", () => {
    let title = taskDialogInputTitle.value
    let description = taskDialogInputDescription.value
    taskManager.add(title, description)
    display.renderTasks(taskManager.getTasks(), projectManager.activeProjectId);
    taskDialogInputTitle.value = "";
    taskDialogInputDescription.value = "";
    taskDialog.close();
});
}

display.onEditTask = (id) => {
    const currentProject = projectManager.getActiveProject();
    let task = currentProject[0].tasks.find(t => t.id == id);
    console.log('task ', task.title);

    taskDialogInputDescription = task.description;
    taskDialogInputTitle = task.title;
    taskDialog.showModal();

    taskDialogAddbtn.addEventListener("click", () => {
        let data = {};
        data.title = taskDialogInputTitle.value
        data.description = taskDialogInputDescription.value
        taskManager.update(id, data);
        display.renderTasks(taskManager.getTasks(), projectManager.activeProjectId);
        taskDialogInputTitle.value = "";
        taskDialogInputDescription.value = "";
        taskDialog.close();
    })
}

