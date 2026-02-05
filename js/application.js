/*************************************************
 * OBSERVABLE
 *************************************************/
class Observable {
    constructor() {
        this.subscribers = [];
    }

    subscribe(fn) {
        this.subscribers.push(fn);
    }

    notify() {
        this.subscribers.forEach(fn => fn());
    }
}

/*************************************************
 * MODELS ( PROJET ET TODO )
 *************************************************/
class ToDoModel {
    constructor({ title, description }) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
    }

    update({ title, description }) {
        if (title !== undefined) this.title = title;
        if (description !== undefined) this.description = description;
    }
}

class ProjectModel {
    constructor({ name, todos = [] }) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.todos = todos;
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    deleteTodo(deletedTodo) {
        this.todos = this.todos.filter( todo => todo.id !== deletedTodo.id )
    }

    update({ name }) {
        if (name !== undefined) this.name = name;
    }
}

/*************************************************
 * COLLECTION ( PROJECTS COLLECTION )
 *************************************************/
class ProjectsCollection extends Observable {
    constructor(projects = []) {
        super();
        this.projects = projects;
        this.activeProjectId = projects[0].id;
    }

    getActiveProject() {
        return this.projects.find(p => p.id === this.activeProjectId);
    }

    getProject(id) {
        return this.projects.find(p => p.id === id);
    }

    addProject(project) {
        this.projects.push(project);
        this.activeProjectId = project.id;
        this.notify();
    }

    deleteProject(deletedProject) {
        this.projects = this.projects.filter( project => project.id !== deletedProject.id);
        this.notify();
    }

    updateProject({ id, name }) {
        const project = this.getProject(id);
        if (!project) return;
        project.update({ name });
        this.notify();
    }

}

/*********************************************************
 * MODAL SINGLETON ( Gestion affichage du background gris )
 *********************************************************/
const GreyModal = (() => {
    const element = document.getElementById('grey-modal-background');

    return {
        show(content) {
            element.innerHTML = '';
            element.appendChild(content);
            element.classList.remove('hidden');
        },
        hide() {
            element.innerHTML = '';
            element.classList.add('hidden');
        }
    };
})();

/**********************************************************************
 * BASE FORM
 * 
 * La function render() permet d'obtenir le formulaire qui
 * sera passé et affiché dans le GreyModal )
 **********************************************************************/
class BaseForm {
    constructor() {
        this.form = document.createElement('form');
        this.form.className = 'modal';
    }

    render() {
        return this.form;
    }
}

/*************************************************
 * CREATE PROJECT FORM
 *************************************************/
class CreateProjectForm extends BaseForm {
    constructor(collection) {
        super();
        this.collection = collection;
        this.build();
    }

    build() {
        this.form.innerHTML = `
            <label>Nom du projet</label>
            <input type="text" />
            <div class="actions">
                <button type="submit">Créer</button>
                <button type="button" class="cancel">Annuler</button>
            </div>
        `;

        const addBtn = this.form.querySelector('button[type="submit"]');
        addBtn.className = "add-btn";

        const cancelBtn = this.form.querySelector('.cancel');
        cancelBtn.className = "cancel-btn";

        const input = this.form.querySelector('input');

        cancelBtn.onclick = () => GreyModal.hide();

        this.form.onsubmit = e => {
            e.preventDefault();
            if (!input.value.trim()) return;

            const project = new ProjectModel({
                id: crypto.randomUUID(),
                name: input.value.trim()
            });

            this.collection.addProject(project);
            GreyModal.hide();
        };
    }
}

/*************************************************
 * EDIT PROJECT FORM
 *************************************************/
class EditProjectForm extends BaseForm {
    constructor(collection, project) {
        super();
        this.collection = collection;
        this.project = project;
        this.build();
    }

    build() {
        this.form.innerHTML = `
            <label>Nom du projet</label>
            <input type="text" value="${this.project.name}" />
            <div class="actions">
                <button type="submit">Mettre à jour</button>
                <button type="button" class="cancel">Annuler</button>
            </div>
        `;

        const input = this.form.querySelector('input');

        const editBtn = this.form.querySelector('button[type="submit"]');
        editBtn.className = "edit-btn";

        const cancelBtn = this.form.querySelector('.cancel');
        cancelBtn.className = "cancel-btn";

        cancelBtn.onclick = () => GreyModal.hide();

        this.form.onsubmit = e => {
            e.preventDefault();
            if (!input.value.trim()) return;

            this.collection.updateProject({
                id: this.project.id,
                name: input.value.trim()
            });

            GreyModal.hide();
        };
    }
}

/*************************************************
 * CREATE TODO FORM
 *************************************************/

class CreateToDoForm extends BaseForm {
    constructor(collection) {
        super();
        this.collection = collection;
        this.build();
    }

    build() {
        this.form.innerHTML = `
            <label for="todo-name">Nom de la tâche</label>
            <input type="text" id="todo-name" />
            <label for="todo-description">Description</label>
            <input type="text" id="todo-description" />
            <div class="actions">
                <button type="submit">Créer</button>
                <button type="button" class="cancel">Annuler</button>
            </div>
        `;

        const addBtn = this.form.querySelector('button[type="submit"]');
        addBtn.className = "add-btn";

        const cancelBtn = this.form.querySelector('.cancel');
        cancelBtn.className = "cancel-btn";

        const inputName = this.form.querySelector('#todo-name');
        const inputDescription = this.form.querySelector('#todo-description');

        cancelBtn.onclick = () => GreyModal.hide();

        this.form.onsubmit = e => {
            e.preventDefault();

            this.activeProject = this.collection.getActiveProject()
            const todo = new ToDoModel({title: inputName.value, description: inputDescription.value})
            this.activeProject.addTodo(todo)
            this.collection.notify();
            GreyModal.hide();
        }
    }
}

/*************************************************
 * EDIT TODO FORM
 *************************************************/

class EditToDoForm extends BaseForm {
    constructor(collection, todo) {
        super();
        this.collection = collection;
        this.todo = todo;
        this.build();
    }

    build() {
        // Sensible aux injections XSS.
        this.form.innerHTML = `
            <label for="todo-name">Nom de la tâche</label>
            <input type="text" id="todo-name" value="${this.todo.title}" />
            <label for="todo-description"></label>
            <input type="text" id="todo-description" value="${this.todo.description}" />
            <div class="actions">
                <button type="submit">Mettre à jour</button>
                <button type="button" class="cancel">Annuler</button>
            </div>
        `;

        const editBtn = this.form.querySelector('button[type="submit"]');
        editBtn.className = "edit-btn";

        const cancelBtn = this.form.querySelector('.cancel');
        cancelBtn.className = "cancel-btn";

        const inputName = this.form.querySelector('#todo-name');
        const inputDescription = this.form.querySelector('#todo-description');

        cancelBtn.onclick = () => GreyModal.hide();

        this.form.onsubmit = e => {
            e.preventDefault();

            this.todo.update({title: inputName.value, description: inputDescription.value});
            this.collection.notify();
            GreyModal.hide();
        }
    }
}

/*************************************************
 * PROJECT LIST COMPONENT
 *************************************************/
class ProjectListComponent {
    constructor(container, collection) {
        this.container = container;
        this.collection = collection;

        this.collection.subscribe(() => this.render());
        this.collection.subscribe(() => {
            localStorage.setItem('localCollection', JSON.stringify({
                projects: this.collection.projects,
                activeProjectId: this.collection.activeProjectId
            }))});
        this.render();
    }

    render() {
        this.container.innerHTML = '';

        const ul = document.createElement('ul');

        this.collection.projects.forEach(project => {
            const li = document.createElement('li');
            li.textContent = project.name;
            li.dataset.id = project.id;

            const editBtn = document.createElement('button');
            editBtn.textContent = 'edit';
            editBtn.className = 'edit-btn'

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'delete';
            deleteBtn.className = 'cancel-btn'

            li.appendChild(editBtn);
            li.appendChild(deleteBtn);

            editBtn.onclick = () => {
                this.collection.activeProjectId = project.id;
                GreyModal.show(new EditProjectForm(this.collection, project).render());
            };

            deleteBtn.onclick = () => {
                if (this.collection.projects.length == 1) { alert("Nombre de projet insuffisant"); return; }
                this.collection.deleteProject(project);
            }

            li.onclick = () => {
                this.collection.activeProjectId = project.id;
                this.collection.notify();
            };

            ul.appendChild(li);
        });

        const addBtn = document.createElement('button');
        addBtn.textContent = 'Créer un projet';
        addBtn.className = "add-btn";
        addBtn.onclick = () => {
            GreyModal.show(new CreateProjectForm(this.collection).render());
        };

        this.container.appendChild(ul);
        this.container.appendChild(addBtn);
    }
}

/*************************************************
 * TODO LIST COMPONENT
 *************************************************/
class ToDoListComponent {
    constructor(container, collection) {
        this.container = container;
        this.collection = collection;

        this.collection.subscribe(() => this.render());
        this.render();
    }

    render() {

        this.container.innerHTML = '';

        const createTodoBtn = document.createElement('button');
        createTodoBtn.innerText = 'Ajouter une tâche';
        createTodoBtn.className = "add-btn"

        // Si aucune projet, ne pas permettre l'ajout de tâche.
        if(this.collection.projects.length == 0) { return };
        createTodoBtn.onclick = () => {
            GreyModal.show(new CreateToDoForm(this.collection).render());
        };
        this.container.appendChild(createTodoBtn);

        this.activeProject = this.collection.getActiveProject();
        if (!this.activeProject || this.activeProject == null) { return }
        this.activeProject.todos.forEach(todo => {
            const div = document.createElement('div');
            div.className = "todo";
            div.dataset.id = todo.id;

            const titre = document.createElement('h2');
            titre.textContent = todo.title;

            const description = document.createElement('p');
            description.textContent = todo.description;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Supprimer la tâche'

            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                this.activeProject.deleteTodo(todo);
                this.collection.notify();
            }

            div.onclick = () => {
                GreyModal.show(new EditToDoForm(this.collection, todo).render());
            }

            div.appendChild(titre);
            div.appendChild(description);
            div.appendChild(deleteBtn);
            this.container.appendChild(div);
        })
    }
}

/*************************************************
 * APP INIT
 *************************************************/
document.addEventListener('DOMContentLoaded', () => {
    const projectContainer = document.getElementById('app');
    const todosContainer = document.getElementById('todos');

    // Récupérer et afficher la collection sauvegardée sur l'ordinateur
    // si elle existe.
    const storedUserData = localStorage.getItem('localCollection');
    if (storedUserData) { 

        const parsed = JSON.parse(storedUserData);

        // Reconstruction des classes
        const projects = parsed.projects.map(projectData => {

            const todos = projectData.todos.map(todoData => {
                return new ToDoModel({
                    title: todoData.title,
                    description: todoData.description
                });
            });

            return new ProjectModel({
                name: projectData.name,
                todos: todos
            });
        });

        collection = new ProjectsCollection(projects);

        console.log("[+] Collection reconstruite depuis le localStorage :", collection);

    // Sinon créer une nouvelle collection par défaut.
    } else {

        collection = new ProjectsCollection([
            new ProjectModel({
                name: 'Projet initial',
                todos: [
                    new ToDoModel({title: 'test', description: 'test'}),
                    new ToDoModel({title: 'test', description: 'test'})
                ] 
            })
        ]);
    }

    new ProjectListComponent(projectContainer, collection);
    new ToDoListComponent(todosContainer, collection);
});