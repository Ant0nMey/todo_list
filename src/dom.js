export default class Display {
    constructor () {
        this.projectsDiv = document.querySelector('.projects-container');
        this.tasksDiv = document.querySelector('main');

        /* Définition des callbacks dans index.js */
        this.onAddProject = null;
        this.onSelectProject = null;
        this.onDeleteProject = null;

        this.onAddTask = null;
        this.onDeleteTask = null;
        this.onEditTask = null;
    }

    /* - La function renderProjects permet d'afficher tous les projets dans la sidebar.
       - Le paramètre 'activeProjectId' permet d'ajouter sur le projet actif la
         class : 'active'.
       - Les paramètre 'projects' et 'activeProjectId' sont récupérés
         via projectManager.activeProjectId et projectManager.projects dans index.js via
         la classe 'ProjectManager'.
    */
    renderProjects(projects, activeProjectId) {
        this.projectsDiv.innerHTML = "";

        projects.forEach(project => {
            const div = document.createElement("div");
            div.className = "project";
            div.dataset.id = project.id;
            div.textContent = project.name;
 
            if (project.id === activeProjectId) div.classList.add("active");

            /* Exécution du callback .onSelectProject lors d'un click
            sur la div d'un projet */
            div.addEventListener("click", () => {
                if (this.onSelectProject) this.onSelectProject(project.id)
            });

            const del = document.createElement("button");
            del.textContent = "-";
            /* Exécution du callback .onDeleteProject lors du click
            sur le bouton delete du projet*/
            del.addEventListener("click", e => {
                e.stopPropagation();
                if (this.onDeleteProject) this.onDeleteProject(project.id);
            });

            /* Autoriser seulement le projet Actif à ajouter des tâches. */
            if (project.id === activeProjectId) {
            const addTask = document.createElement("button");
            addTask.textContent = "+ tâche";
            /* Exécution du callback .onAddTask lors du click
            sur le bouton '+ tâche' du projet*/
            addTask.addEventListener("click", e => {
                e.stopPropagation();
                if (this.onAddTask) this.onAddTask();
            });

            div.append(del, addTask);
            this.projectsDiv.appendChild(div);
            } else {  
            /* Autoriser la suppresion de projet pour tous le monde. */
            div.append(del);
            this.projectsDiv.appendChild(div);
            }
        });
    }

    renderTasks(tasks) {
        this.tasksDiv.innerHTML ="";

        tasks.forEach(task => {
            const div = document.createElement("div");
            div.className = "task";
            div.setAttribute('data-id', task.id);

            const title = document.createElement("h3");
            title.textContent = task.title;

            const desc = document.createElement("p");
            desc.textContent = task.description;

            const btnDiv = document.createElement("div");
            btnDiv.className = "btn-div"

            /* Exécution du callback .onDeleteTask lors du click
               sur le bouton delete de la tâche*/
            const del = document.createElement("button");
            del.textContent = "Supprimer";
            del.addEventListener("click", () => {
                if (this.onDeleteTask) this.onDeleteTask(task.id);
            });

            /* Exécution du callback .onEditTask lors du click
            sur le bouton Modifier de la tâche*/
            const edit = document.createElement("button");
            edit.textContent = "Modifier"
            edit.addEventListener("click", () => {
                if (this.onEditTask) this.onEditTask(task.id);
            })

            btnDiv.append(edit, del)
            div.append(title, desc, btnDiv);
            this.tasksDiv.appendChild(div);
        });
    }
}