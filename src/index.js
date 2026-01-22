import "./styles.css";
import Display from "./dom.js";
import ProjetManager from "./projetManager.js";

const display = new Display();
const projetManager = new ProjetManager();

let buttonAdd = document.getElementById("ajouter-projet-btn");
buttonAdd.addEventListener('click', () => {
    const InputName = document.getElementById("ajouter-projet-input").value;
    projetManager.add(InputName);
    display.projects(projetManager.getAll());
});

display.onDeleteProject = (id) => {
    projetManager.delete(id);
    display.projects(projetManager.getAll());
}