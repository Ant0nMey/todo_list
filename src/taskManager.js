import projectManager from "./projetManager.js";

export default class TaskManager {
    constructor(projectManager) {
        this.projectManager = projectManager; // référence au ProjectManager
    }

    addTask(title, description, date) {
        const project = this.projectManager.getActiveProject();
        if (!project) return;
        project.tasks.push({
            id: crypto.randomUUID(),
            title,
            done: false,
            description,
            date
        });
    }

    deleteTask(taskId) {
        const project = this.projectManager.getActiveProject();
        if (!project) return;
        project.tasks = project.tasks.filter(t => t.id !== taskId);
    }

    getTasks() {
        const project = this.projectManager.getActiveProject();
        return project ? [...project.tasks]: [];
    }
}
