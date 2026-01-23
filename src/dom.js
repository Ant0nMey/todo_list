export default class Display {
    constructor() {
        this.projectsdiv = document.querySelector(".projects-container");
        this.onDeleteProject = null;
        this.onProjetActif = null;
        this.projetActifId = null; // <- projet actif stocké ici
    }

    projects(projectsArray) {
        this.projectsdiv.innerHTML = "";
        projectsArray.forEach(project => this.#createProjectDiv(project));
    }

    #createProjectDiv(project) {
        let div = document.createElement("div");
        div.dataset.projectId = project.id;
        div.className = "project";
        div.innerText = project.name;

        // Bouton delete
        let button = document.createElement("button");
        button.className = "delete-project-btn";
        button.innerText = "-";
        button.type = "button";

        button.addEventListener('click', (e) => {
            e.stopPropagation(); // empêche le clic sur le div
            if (this.onDeleteProject) {
                this.onDeleteProject(project.id);
            }
        });

        // Click sur le projet pour le rendre actif
        div.addEventListener('click', () => {
            this.projetActifId = project.id;

            // Marque visuellement le projet actif
            this.projectsdiv.querySelectorAll('.project').forEach(p => {
                p.classList.toggle('active', p.dataset.projectId === this.projetActifId);
            });

            // Callback pour le projet actif
            if (this.onProjetActif) {
                this.onProjetActif(this.projetActifId);
            }
        });

        div.appendChild(button);
        this.projectsdiv.appendChild(div);
    }
}