import Project from "./projet";

export default class ProjectManager {
    constructor() {
        this.projects = [];
        this.activeProject = [];
    }

    add(projectName) {
        const project = new Project(projectName);
        this.projects.push(project);
        console.log('project.id :', project.id)
        this.activeProject.pop();
        this.activeProject.push(project); // Par défaut, le projet créé devient projet actif.
        return project;
    }

    delete(id) {
        this.projects = this.projects.filter(p => p.id !== id);
    }

    getAll() {
        return this.projects;
    }

    setActiveProject(id) {
        this.activeProject = this.projects.filter(t => t.id === id )
    }

    getActiveProject() {
        return this.activeProject[0];
    }
}