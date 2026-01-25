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
        /* Le projet ajouté récupère la classe .active. */
        this.#findAndRemoveActiveClass();
        div.classList.add('project', 'active');

        div.innerText = project.name;

        let button = document.createElement('button');
        button.className = "delete-project-btn";
        button.innerText = "-";
        
        /* - Listerner sur le bouton 'supprimer' du projet.
            Le callback onDeleteProject est appelé en clickant sur le bouton delete du projet.
            Le callback permet de récupéré l'id du projet associé via le DOM et de le passer à la
            fonction delete() du projectManager. */
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Récupérer seulement le click bouton delete.
            if (this.onDeleteProject) {
            this.tasksContainerDiv.innerHTML = ""; // Supprime l'affichage des tâches du projet.
            
            const projectId = e.target.closest('.project').dataset.projectId;
            this.onDeleteProject(projectId)

        }});

        /* Listener sur le texte du projet.
           Si le projet est cliqué :
            - il passe actif dans le constructeur de la classe Display
            - Ajout de la classe 'active' sur le projet dans le DOM.
        */
        div.addEventListener('click', (e) => {
            const projectId = e.target.closest('.project').dataset.projectId;
            this.onActiveProject(projectId);

            /* Le projet ajouté récupère la classe .active */
            this.#findAndRemoveActiveClass();
            e.target.classList.add("active");

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

        /* création de la carte 'div' pour la tâche ajouté. Elle comportera les éléments suivant :
             - id (sous forme de classe)
             - titre (h2)
             - description (p)
             - un bouton permettant de supprimer la tâche.
        */
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
            e.stopPropagation(); // Récupérer seulement le click bouton delete.
            if (this.onDeleteTask) {
                const taskId = e.target.closest('.task').dataset.taskId;
                /* onDeleteProject est un callback constructor. Si click sur bouton supprimer :
                    exécute la fonction onDeleteProject défini dans index.js */
                this.onDeleteTask(taskId);
        }});
    }  

    #findAndRemoveActiveClass() {
        if (document.querySelector('.active')) {
            let activeDivProject = document.querySelector('.active');
            activeDivProject.classList.remove("active");
        }
    }
}