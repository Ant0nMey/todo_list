import Projet from "./projet";

export default class ProjectManager {
    constructor() {
        this.projects = [];
        this.activeProjectId = null;
    }

    add(projectName) {
        const project = new Projet(projectName);
        this.projects.push(project);
        // Par défaut, le nouveau projet devient actif
        this.activeProjectId = project.id;

        return project;
    }

    delete(id) {
        this.projects = this.projects.filter(p => p.id !== id);
    }

    getAll() {
        return this.projects;
    }

    getActiveProject() {
        if (!this.activeProjectId) return null;
        return this.projects.find(p => p.id === this.activeProjectId) || null;
    }

    setActiveProject(id) {
        if (this.projects.some(p => p.id === id)) {
            this.activeProjectId = id;
        }
    }
}