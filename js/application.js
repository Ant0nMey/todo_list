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
 * MODELS
 *************************************************/
class ToDoModel {
    constructor({ id, title, description }) {
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
    constructor({ id, name }) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    update({ name }) {
        if (name !== undefined) this.name = name;
    }
}

/*************************************************
 * COLLECTION
 *************************************************/
class ProjectsCollection extends Observable {
    constructor(projects = []) {
        super();
        this.projects = projects;
        this.activeProjectId = projects.length ? projects[0].id : null;
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

    updateProject({ id, name }) {
        const project = this.getProject(id);
        if (!project) return;
        project.update({ name });
        this.notify();
    }
}

/*************************************************
 * MODAL SINGLETON
 *************************************************/
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

/*************************************************
 * BASE FORM
 *************************************************/
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

        const input = this.form.querySelector('input');
        const cancelBtn = this.form.querySelector('.cancel');

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
        const cancelBtn = this.form.querySelector('.cancel');

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
 * PROJECT LIST COMPONENT
 *************************************************/
class ProjectListComponent {
    constructor(container, collection) {
        this.container = container;
        this.collection = collection;

        this.collection.subscribe(() => this.render());
        this.render();
    }

    render() {
        this.container.innerHTML = '';

        const ul = document.createElement('ul');

        this.collection.projects.forEach(project => {
            const li = document.createElement('li');
            li.textContent = project.name;
            li.dataset.id = project.id;

            li.onclick = () => {
                this.collection.activeProjectId = project.id;
                GreyModal.show(new EditProjectForm(this.collection, project).render());
            };

            ul.appendChild(li);
        });

        const addBtn = document.createElement('button');
        addBtn.textContent = 'Créer un projet';
        addBtn.onclick = () => {
            GreyModal.show(new CreateProjectForm(this.collection).render());
        };

        this.container.appendChild(ul);
        this.container.appendChild(addBtn);
    }
}

class ToDoListComponent {
    constructor(container, collection) {
        this.container = container;
        this.collection = collection;
        
    }
}

/*************************************************
 * APP INIT
 *************************************************/
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app');

    const collection = new ProjectsCollection([
        new ProjectModel({ id: crypto.randomUUID(), name: 'Projet initial' })
    ]);

    new ProjectListComponent(container, collection);
});
