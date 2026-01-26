import Task from "./task.js"

export default class TaskManager {
    constructor(projectManager) {
        this.projectManager = projectManager;
    }

    add(title, description) {
        const currentProject = this.projectManager.getActiveProject();
        if (!currentProject) return;

        currentProject[0].tasks.push(new Task(title, description));
    }

    delete(taskId) {
        const currentProject = this.projectManager.getActiveProject();
        if(!currentProject) return;
        console.log('currentProject :', currentProject[0].tasks);
        currentProject[0].tasks = currentProject[0].tasks.filter(t => t.id !== taskId);
    }

    update(taskId, data) {
        const currentProject = this.projectManager.getActiveProject();
        if (!currentProject) return;

        const task = currentProject[0].tasks.find(t => t.id === taskId);
        if (!task) return;

        task.title = data.title;
        task.description = data.description;
    }

    getTasks() {
        const currentProject = this.projectManager.getActiveProject();
        if ( currentProject.length == 0 ) { return [] }; // Empêcher la lecture des tâches si pas de projet.
        return currentProject ? currentProject[0].tasks : [];
    }
}
