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
        try {
            this.setActiveProject(this.projects.slice(-1)[0].id);
        } catch (error) {
            console.log('Plus de projet actif')
        }
    }

    setActiveProject(id) {
        this.activeProjectId = id;
    }

    getActiveProject() {
        return this.projects.find(p => p.id === this.activeProjectId) || null;
    }

    getAll() {
        return this.projects;
    }
}