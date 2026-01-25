import Task from "./task.js"

export default class TaskManager {
    constructor(projectManager) {
        this.projectManager = projectManager;
    }

    add(title, description) {
        const task = new Task(title, description);
        const currentProject = this.projectManager.getActiveProject();
        currentProject.tasks.push(task);
    }

    getActiveProjectTask () {
        if (this.projectManager.projects[0] == undefined) {
            console.log('ok');
            return [];
        }
        const currentProject = this.projectManager.getActiveProject();
        console.log('getActiveprojecttask() -> currentProject : ', currentProject);
        return currentProject.tasks;
    }

    delete(id) {
        // Je n'ai pas trouvé de moyen plus simple. A revoir.
        this.projectManager.activeProject[0].tasks = this.projectManager.activeProject[0].tasks.filter(t => t.id !== id );
    }
}
