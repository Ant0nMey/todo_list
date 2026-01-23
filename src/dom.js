export default class Display {
    constructor () {
        this.projectsContainerDiv = document.querySelector('.projects-container');
        this.tasksContainerDiv = document.querySelector('main');
        this.addProjectBouton = document.getElementById('ajouter-projet-btn');
        this.onDeleteProject = null;
        this.onDeleteTask = null;
        this.onActiveProject = null;
    }

    projects (projectsArray) {

        this.projectsContainerDiv.innerHTML = "";

        projectsArray.forEach((project => {
        this.#createProjectDiv(project);

        }));
    };

    #createProjectDiv (project) {

        let div = document.createElement('div');

        div.dataset.projectId = project.id;
        div.className= "project"
        div.innerText = project.name;

        let button = document.createElement('button');
        button.className = "delete-project-btn";
        button.innerText = "-";

        button.addEventListener('click', (e) => {

            // Récupérer seulement le click bouton delete.
            e.stopPropagation();

            /* - Le callback onDeleteProject est appelé en clickant sur le bouton delete d'un projet.
            Le callback permet de récupéré l'id du projet associé via le DOM et de le passer à la
            fonction delete() du projectManager. */
            if (this.onDeleteProject) {
            const projectId = e.target.closest('.project').dataset.projectId;
            this.onDeleteProject(projectId);
        }});

        div.addEventListener('click', (e) => {
            const projectId = e.target.closest('.project').dataset.projectId;
            this.onActiveProject(projectId);

        })

        div.appendChild(button);
        this.projectsContainerDiv.appendChild(div);

    }

    tasks (projectTasks) {

        this.tasksContainerDiv.innerHTML = "";

        projectTasks.forEach(task => {
            this.#createTaskDiv(task);
        });
    }

    #createTaskDiv (task) {

        let div = document.createElement("div");

        div.dataset.taskId = task.id;
        div.className= "task"

        let divTitle = document.createElement("h2")
        divTitle.innerText = task.title;

        let divDescription = document.createElement("p")
        divDescription.innerText = task.description;

        div.appendChild(divTitle);
        div.appendChild(divDescription);

        let button = document.createElement("button");
        button.className = "delete-task-btn";
        button.innerText = "-";
        
        div.appendChild(button);

        this.tasksContainerDiv.appendChild(div);

        button.addEventListener('click', (e) => {
        // Récupérer seulement le click bouton delete.
        e.stopPropagation();
        if (this.onDeleteTask) {
            const taskId = e.target.closest('.task').dataset.taskId;
            console.log('button delete dans dom.js')
            console.log('e.target.closest(".task").dataset.taskId', e.target.closest('.task').dataset.taskId)
            /* onDeleteProject est un callback constructor. Si click sur bouton supprimer :
               exécute la fonction onDeleteProject défini dans index.js
            */
            this.onDeleteTask(taskId);
        }});
    }   
}