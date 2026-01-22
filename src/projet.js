export default class Projet {
    static projetContainer = [];

    constructor(name) {
        this.name = name;
        this.id = crypto.randomUUID();
        Projet.projetContainer.push(this);
    }

    static getAllProjects() {
        console.log(Projet.projetContainer);
    }

    getProjectIndex(name) {  
        const findObject = Projet.projetContainer.findIndex(obt => obt.name === name);
        console.log(`${findObject}`);
    }

}