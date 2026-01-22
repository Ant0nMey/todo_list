export default class Display {
    constructor () {
        this.projectsdiv = document.querySelector(".projects-container");
        this.onDeleteProject = null;
    }

    projects (projectsArray) {

        this.projectsdiv.innerHTML = "";

        projectsArray.forEach((project => {
        this.#createProjectDiv(project);
        }));
    };

    #createProjectDiv (project) {

        let div = document.createElement("div");

        div.dataset.projectId = project.id;
        div.className= "project"
        div.innerText = project.name;

        let button = document.createElement("button");
        button.className = "delete-project-btn";
        button.innerText = "-";

        button.addEventListener('click', (e) => {
            if (this.onDeleteProject) {
            const projectId = e.target.closest('.project').dataset.projectId;
            /* onDeleteProject est un callback constructor. Si appuie sur bouton supprimer :
               exécute la fonction onDeleteProject défini dans index.js
            */
            this.onDeleteProject(projectId);
        } 
        });
        div.appendChild(button);
        this.projectsdiv.appendChild(div);
        }

}