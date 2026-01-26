import Task from "./task.js"

export default class TaskManager {
    constructor(projectManager) {
        this.projectManager = projectManager;
    }

    add(title, description) {
        const currentProject = this.projectManager.getActiveProject();
        if (!currentProject) return;

        currentProject.tasks.push(new Task(title, description));
    }

    delete(taskId) {
        const currentProject = this.projectManager.getActiveProject();
        if(!currentProject) return;

        currentProject.tasks = project.tasks.filter(t => t.id !== taskId);
    }

    update(taskId, data) {
        const currentProject = this.projectManager.getActiveProject();
        if (!currentProject) return;

        const task = currentProject.tasks.find(t => t.id === taskId);
        if (!task) return;

        task.title = data.title;
        task.description = data.description;
    }

    getTasks() {
        const currentProject = this.projectManager.getActiveProject();
        return currentProject ? currentProject.tasks : [];
    }
}
