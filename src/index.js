import "./styles.css";
import Projet from "./projet.js";
window.Projet = Projet;

let buttonAdd = document.getElementById("ajouter-projet-btn");
buttonAdd.addEventListener('click', () => {
    let name = document.getElementById("ajouter-projet-input").value;
    let projet = new Projet(name);
    console.log("Projet ajouté: ", projet)
})