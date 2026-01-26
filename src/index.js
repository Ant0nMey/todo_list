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

/* Lors de l'ajout d'un projet :
     - Ajouter le projet dans la sidebar.
     - Définir le nouveau projet créé comme projet actif. */

addProjectBtn.addEventListener("click", () => {
    console.log('add bouton hit');
    projectDialog.showModal();
    projectDialogAddbtn.addEventListener("click", () => {
            projectManager.add(projectDialogInputTitle.value);
            display.renderProjects(projectManager.getAll(), projectManager.getActiveProject());
            projectDialog.close();
        })
    })


/* Lors de l'ajout d'une tâche :
     - Ajouter la tâche dans le projet actif.
     - Afficher toutes les tâches du projet actif. */


/* - Le callback onDeleteProject est appelé en clickant sur le bouton delete d'un projet.
     Le callback permet de récupéré l'id du projet associé via le DOM et de le passer à la
     fonction delete() du projectManager.
   - Nous réaffichons ensuite toutes les projets dans la sidebar. */
display.onDeleteProject = (id) => {
    projectManager.delete(id);
    display.projects(projectManager.getAll());
    display.tasks(taskManager.getTasks());
}
/*  Le callback onActiveProject est appelé en clickant sur un projet
    Le callback permet de passer le projet clické dans l'état actif. */
display.onSelectProject = (id) => {
    projectManager.setActiveProject(id);
    display.tasks(taskManager.getTasks());
}

/*  Le callback onDeleteTask est appelé en clickant sur le bouton delete d'une tâche.
    Le callback permet de récupéré l'id de la tâche associé via le DOM et de le passer à la
    fonction delete() du taskManager. 
    Nous réaffichons ensuite toutes les tâches du projet actif. */
display.onDeleteTask = (id) => {
    taskManager.delete(id);
    display.tasks(taskManager.getTasks());
}
