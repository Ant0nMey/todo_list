import "./styles.css";
import Display from "./dom.js";
import ProjetManager from "./projetManager.js";

const display = new Display();
const projetManager = new ProjetManager();

const buttonAdd = document.getElementById("ajouter-projet-btn");
const inputProject = document.getElementById("ajouter-projet-input");

// Ajouter un projet
buttonAdd.addEventListener('click', () => {
    const name = inputProject.value.trim();
    if (!name) return;

    projetManager.add(name);

    display.projects(projetManager.getAll());
    inputProject.value = "";
});

// Supprimer un projet
display.onDeleteProject = (id) => {
    projetManager.delete(id);
    display.projects(projetManager.getAll());
};

// Sélectionner un projet actif
display.onProjetActif = (id) => {
    projetManager.setActiveProject(id);
    console.log("Projet actif :", projetManager.getActiveProject());
    // Ici tu peux appeler renderTasks() si tu veux afficher les tâches du projet actif
};
