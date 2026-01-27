export default class Display {
    constructor () {
        this.projectsDiv = document.querySelector('.projects-container');
        this.tasksDiv = document.querySelector('main');

        this.onAddProject = null;
        this.onSelectProject = null;
        this.onDeleteProject = null;

        this.onAddTask = null;
        this.onDeleteTask = null;
        this.onEditTask = null;
    }

    renderProjects(projects, activeProjectId) {
        this.projectsDiv.innerHTML = "";

        projects.forEach(project => {
            const div = document.createElement("div");
            div.className = "project";
            div.dataset.id = project.id;
            div.textContent = project.name;
 
            if (project.id === activeProjectId) div.classList.add("active");

            div.addEventListener("click", () => {
                if (this.onSelectProject) this.onSelectProject(project.id)
            });

            const del = document.createElement("button");
            del.textContent = "-";
            del.addEventListener("click", e => {
                e.stopPropagation();
                if (this.onDeleteProject) this.onDeleteProject(project.id);
            });

            /* Afficher le bouton 'ajout de tâche' seulement pour le project actif.
               Sinon afficher seulement le bouton delete. */
            if (project.id === activeProjectId) {
            const addTask = document.createElement("button");
            addTask.textContent = "+ tâche";
            addTask.addEventListener("click", e => {
                e.stopPropagation();
                if (this.onAddTask) this.onAddTask();
            });

            div.append(del, addTask);
            this.projectsDiv.appendChild(div);
            } else {  
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

            const del = document.createElement("button");
            del.textContent = "Supprimer";
            del.addEventListener("click", () => {
                if (this.onDeleteTask) this.onDeleteTask(task.id);
            });

            const edit = document.createElement("button");
            edit.textContent = "Modifier"
            edit.addEventListener("click", () => {
                let dialog = document.getElementById("task-dialog")
                dialog.className += "edit"
                if (this.onEditTask) this.onEditTask(task.id);
                dialog.classList.remove('edit')
            })

            btnDiv.append(edit, del)
            div.append(title, desc, btnDiv);
            this.tasksDiv.appendChild(div);
        });
    }
}