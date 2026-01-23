export default class Projet {
    constructor(name) {
        this.name = name;
        this.id = crypto.randomUUID();
        this.tasks = [];
    }
}