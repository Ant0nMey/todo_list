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

    getToDo(id) {
        let activeProject = this.getActiveProject();
        return activeProject.toDos.find( it => it.id === id);
    }

    updateToDo(obj) {
        console.log('obj :', obj);
        const tudo = this.getToDo(obj.id);
        tudo.updateProperties(obj);
        this.notifySubscriber();
    }

    removeToDo(id) {
        const project = this.getActiveProject();
        project.toDos = project.toDos.filter(todo => todo.id !== id);
        this.notifySubscriber();
    }
}

/**
 * GreyModalElement is a singleton
 */
const GreyModalElement = function() {
    const element = document.getElementById('grey-modal-background');
    return {

        /**
         * Show the modal.
         * 
         * @return void
         */
        show: function() {
            element.classList.remove('hidden');
        },

        /**
         * Hide the modal and clear its content.
         * 
         * @return void
         */
        hide: function() {
            element.innerHTML = "";
            element.classList.add('hidden');
        },

        /**
         * Append child element to the modal.
         * 
         * @return void
         */
        appendChild: function(childElement) {
            element.appendChild(childElement);
        }
    }
}();

/**
 * Project component. We call this a component as its behaviour is a
 * reusable component for web composition.
 * 
 * With this design it is also easier to map it over to a true web-component,
 * which will hopefully soon become a standard in all the major browsers.
 */
/*class ProjectComponent {

    constructor(obj){
        this.containerElement = obj.containerElement;
        this.fileds = ProjectModel.getFields();
        this.updateProperties(obj);

        this.showCreateProjectModalFn = () => {
            const createProjectForm =
                new CreateProjectFormComponent({}, this.projectsCollection)
            createProjectForm.render();

            GreyModalElement.appendChild(createProjectForm.formElement);
            GreyModalElement.show();
            createProjectForm.inputFieldForTitle.focus();
        };

        this.showEditProjectModalFn = event => {
            const projectId =
                event.target.getAttribute("data-project-id");

        const editProjectForm =
            new EditProjectFormComponent(
                {},
                this.projectsCollection,
                this.projectsCollection.getProject(projectId)
            );
            editProjectForm.render()
        }
    }
}
*/

class BaseFormAbstract{

    constructor(obj){
        if (new.target === BaseFormAbstract) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.method = obj.method || 'POST';
        this.action = obj.action || null;
        this.enctype = obj.enctype || null;

        this.buildDOMElements();
        this.updateAttributes();
    }

    buildDOMElements() {
        this.formElement = document.createElement('FORM');

        this.submitButtonElement = document.createElement('BUTTON');
        this.submitButtonElement.type = "submit";
        this.submitButtonElement.textContent = 'Submit';
    }

    updateAttributes() {
        this.formElement.method = this.method;
        this.formElement.action = this.action;
        if(this.enctype){
            this.formElement.enctype = this.enctype;
        }
    }

    submit(){
        this.formElement.submit();
    }
}

/**
 * Abstract class ProjectFormAbstract
 * This class contains business logic for the project form.
 */
class ProjectFormAbstract extends BaseFormAbstract {

    constructor(obj){
        super(obj);
        if (new.target === ProjectFormAbstract) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        this.destroyFormFn = () => {
            GreyModalElement.hide()
        };

        this.submitEventFn = event => {
            event.preventDefault();
            this.submit();
        };

        this.updateFormElement();
        this.updateSubmitButtonElement();
        this.buildCancelButton();
    }

    updateFormElement() {
        this.formElement.className = "modal";
    }

    updateSubmitButtonElement() {
        this.submitButtonElement.textContent = "Ajouter projet";
        this.submitButtonElement.classList.add('green');
        this.submitButtonElement.addEventListener('click', this.submitEventFn);
    }
}