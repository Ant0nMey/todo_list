import "./styles.css";
import Display from "./dom.js";
import ProjectManager from "./projetManager.js";
import TaskManager from "./taskMangager.js";

const display = new Display();
const projectManager = new ProjectManager();
const taskManager = new TaskManager(projectManager);
const dialog = document.querySelector("dialog");
const showButton = document.querySelector("dialog + button");
const closeButton = document.querySelector("dialog button");
let buttonAddProject = document.getElementById("ajouter-projet-btn");
let buttonAddTask = document.getElementById("ajouter-tache-btn");

/* Lors de l'ajout d'un projet :
     - Ajouter le projet dans la sidebar.
     - Définir le nouveau projet créé comme projet actif. */
showButton.addEventListener("click", () => {
  dialog.showModal(); // Ouvrir la boite de dialogue demandant le nom du projet à ajouter lors de l'appui sur le bouton.
});

buttonAddProject.addEventListener('click', () => {
    let InputName = document.getElementById("ajouter-projet-input").value;
    if (InputName == "") { return };  // Refuser les noms de projet vide.

    projectManager.add(InputName);

    // Afficher tous les projets et toutes les tâches du projet actif.
    display.projects(projectManager.getAll());
    display.tasks(taskManager.getActiveProjectTask());

    document.getElementById("ajouter-projet-input").value = ''; // Reset de l'input permettant d'ajouter des projets.


    dialog.close(); // Fermer la boite de dialogue à l'ajout du projet.
});

/* Lors de l'ajout d'une tâche :
     - Ajouter la tâche dans le projet actif.
     - Afficher toutes les tâches du projet actif. */
buttonAddTask.addEventListener('click', () => {
    const InputTitle = document.getElementById("ajouter-titre-tache-input").value;
    if (InputTitle == "") { return }; // Refuser les noms de projet vide.
    let InputDescription = document.getElementById("ajouter-description-tache-input").value;

    taskManager.add(InputTitle, InputDescription);   // Ajout de la tâche avec titre et description.

    display.tasks(taskManager.getActiveProjectTask());   // Afficher toutes les tâches du projet actif.
});

/* - Le callback onDeleteProject est appelé en clickant sur le bouton delete d'un projet.
     Le callback permet de récupéré l'id du projet associé via le DOM et de le passer à la
     fonction delete() du projectManager.
   - Nous réaffichons ensuite toutes les projets dans la sidebar. */
display.onDeleteProject = (id) => {
    projectManager.delete(id);
    display.projects(projectManager.getAll());
    display.tasks(taskManager.getActiveProjectTask());
}

/*  Le callback onActiveProject est appelé en clickant sur un projet
    Le callback permet de passer le projet clické dans l'état actif. */
display.onActiveProject = (id) => {
    projectManager.setActiveProject(id);
    display.tasks(taskManager.getActiveProjectTask());
}


/*  Le callback onDeleteTask est appelé en clickant sur le bouton delete d'une tâche.
    Le callback permet de récupéré l'id de la tâche associé via le DOM et de le passer à la
    fonction delete() du taskManager. 
    Nous réaffichons ensuite toutes les tâches du projet actif. */
display.onDeleteTask = (id) => {
    taskManager.delete(id);
    display.tasks(taskManager.getActiveProjectTask());
}
