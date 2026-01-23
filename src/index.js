import "./styles.css";
import Display from "./dom.js";
import ProjectManager from "./projetManager.js";
import TaskManager from "./taskMangager.js";

const display = new Display();
const projectManager = new ProjectManager();
const taskManager = new TaskManager(projectManager);

/* Lors de l'ajout d'un projet :
     - Ajouter le projet dans la sidebar.
     - Définir le nouveau projet créé comme projet actif.
*/
let buttonAddProject = document.getElementById("ajouter-projet-btn");
buttonAddProject.addEventListener('click', () => {
    const InputName = document.getElementById("ajouter-projet-input").value;
    if (InputName == "") { return };
    projectManager.add(InputName);
    console.log('Active Project :', projectManager.getActiveProject())
    display.projects(projectManager.getAll());
    display.tasks(taskManager.getActiveProjectTask());
});

/* Lors de l'ajout d'une tâche :
     - Ajouter la tâche dans le projet actif.
     - Afficher toutes les tâches du projet actif.
*/
let buttonAddTask = document.getElementById("ajouter-tache-btn");
buttonAddTask.addEventListener('click', () => {
    const InputTitle = document.getElementById("ajouter-titre-tache-input").value;
    if (InputTitle == "") { return };
    let InputDescription = document.getElementById("ajouter-description-tache-input").value;
    taskManager.add(InputTitle, InputDescription);
    display.tasks(taskManager.getActiveProjectTask());
});

/* - Le callback onDeleteProject est appelé en clickant sur le bouton delete d'un projet.
     Le callback permet de récupéré l'id du projet associé via le DOM et de le passer à la
     fonction delete() du projectManager.
   - Nous réaffichons ensuite toutes les projets dans la sidebar.
*/
display.onDeleteProject = (id) => {
    projectManager.delete(id);
    display.projects(projectManager.getAll());
}

/* - Le callback onActiveProject est appelé en clickant sur un projet
     Le callback permet de passer le projet clické dans l'état actif.
*/
display.onActiveProject = (id) => {
    projectManager.setActiveProject(id);
    display.tasks(taskManager.getActiveProjectTask());
}


/* - Le callback onDeleteTask est appelé en clickant sur le bouton delete d'une tâche.
     Le callback permet de récupéré l'id de la tâche associé via le DOM et de le passer à la
     fonction delete() du taskManager. 
   - Nous réaffichons ensuite toutes les tâches du projet actif.
*/
display.onDeleteTask = (id) => {
    taskManager.delete(id);
    display.tasks(taskManager.getActiveProjectTask());
}
