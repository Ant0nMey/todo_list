export default class Task {
    constructor(title, description) {
        this.title = title;
        this.id = crypto.randomUUID();
        this.description = description;
    }
}