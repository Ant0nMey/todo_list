class Observable{
    constructor(){
        this.subscribers = [];
    }

    /**
     *  Subscribe for changes
     * Add a function you want to bo executed whenever this model changes.
     * 
     * @params Function fn
     * @return null
     */
    subscribe(fn){
        this.subscribers.push(fn);
    }

    /**
     * Unsubscribe from being notified whenever this model changes.
     * 
     * @params Function fn
     * @return null
     */
    unsubscribe(fn){
        this.subscribers = this.subscribers.filter( it => it !== fn );
    }

    /**
     * Notify subscribers
     * 
     * @return null
     */
    notifySubscriber() {
        this.subscribers.forEach( fn => fn() );
    }
}

class ProjectModel {

    /**
     * @param { id: Number, name: String}
     */
    constructor(obj) {
        this.toDos = [];
        this.updateProperties(obj);
    }

    /**
     * Map properties to this instance
     * 
     * @param {id: Number, name: String}
     * @return void
     */
    updateProperties(obj) {
        this.id = obj.id;
        if(obj.name) this.name = obj.name;
        if(Array.isArray(obj.toDos)) this.toDos = obj.toDos;
    }

    addToDo(todo) {
        this.toDos.push(todo);
    }

    /**
    * Get a list of properties for this class
     * 
    * @return {string[]}
     */
    static getFields() {
    return ['id', 'name', 'todos'];
    }
}

class ProjectsCollectionModel extends Observable{

    constructor(projects) {
        super();
        this.projects = projects;
        this.activeProject = projects[0].id;
    }

    /**
     * Loop through all registerted projects and return
     * the project object that matches the id.
     * 
     * @params Number id
     * @return Project
     */
    getProject(id) {
        return this.projects.find( it => it.id === id);
    }

    getActiveProject() {
        return this.projects.find( it => it.id === this.activeProject)
    }

    /**
     * Register a new project to this collection.
        * Notify the subscriber.
     * 
     * @params Project project
     * @return void
     */
    addProject(project) {
        if (project.name == null) return;
        this.projects.push(project);
        this.activeProject = project.id;
        this.notifySubscriber();
    }

    updateProject(obj) {
        const project = this.getProject(obj.id);
        project.updateProperties(obj);
        this.notifySubscriber();
    }

    addToDoToActiveProject(ToDoModel) {
        const project = this.getActiveProject();
        if (!project) return;

        project.addToDo(ToDoModel);
        this.notifySubscriber();
    }

}

class ToDoModel{

    /**
     * @param {id: Number, title: String, description: String}
     * @return void
     */
    constructor(obj) {
        this.updateProperties(obj);
    }

    /**
     * Map properties to this instance
     * 
     * @param {id: Number, title: String, description: String}
     * @return void
     */
    updateProperties(obj) {
        this.id = obj.id;
        if (obj.title) this.title = obj.title;
        if (obj.description) this.description = obj.description;
    }
    /**
    * Get a list of properties for this class
     * 
    * @return {string[]}
     */
    static getFields() {
    return ['id', 'title', 'description'];
    }
}