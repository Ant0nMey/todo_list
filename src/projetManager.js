import Project from "./projet";

export default class ProjectManager {
    constructor() {
        this.projects = [];
        this.activeProjectId = null;
    }

    add(name) {
        const project = new Project(name);
        this.projects.push(project);
        this.activeProjectId = project.id; // Par défaut, le projet créé devient projet actif.
        return project;
    }

    delete(id) {
        this.projects = this.projects.filter(p => p.id !== id);
        this.activeProjectId = null;
    }

    setActiveProjectId(id) {
        this.activeProjectId = id;
    }

    getActiveProjectId() {
        return this.activeProjectId;
    }

    getActiveProject() {
        return this.projects.filter(p => p.id == this.activeProjectId)
    }

    getAll() {
        return this.projects;
    }
}