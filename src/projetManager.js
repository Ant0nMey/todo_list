import Projet from "./projet";

export default class ProjetManager {
    constructor() {
        this.projets = [];
    }

    add(projectName) {
        const projet = new Projet(projectName);
        this.projets.push(projet);
        return projet;
    }

    delete(id) {
        this.projets = this.projets.filter(p => p.id !== id);
    }

    getAll() {
        return this.projets;
    }
}