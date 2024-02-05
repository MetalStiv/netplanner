import Project, { IProject } from "../model/projectData/Project"

const projectSymbol: unique symbol = Symbol()
const projectToLoadId: unique symbol = Symbol()
const webSocketUpdaterSymbol: unique symbol = Symbol()
const rerenderSymbol: unique symbol = Symbol()
// const inputModeSymbol: unique symbol = Symbol()
// const inputDataSymbol: unique symbol = Symbol()

interface IProjectStore {
    [projectSymbol]: IProject | null,
    [projectToLoadId]: string,
    [webSocketUpdaterSymbol]: (() => void) | null,
    [rerenderSymbol]: boolean,
    // [inputDataSymbol]: string,
    // [inputModeSymbol]: boolean,
    setProject: (p: IProject) => void,
    getProject: () => IProject | null,
    setProjectToLoadId: (id: string) => void,
    getProjectToLoadId: () => string,
    setWebSocketUpdater: (webSocketUpdater: () => void) => void,
    // setInputData: (val: string) => void,
    // getInputData: () => string,
    // addInputKey: (e: KeyboardEvent) => void,
    // setInputMode: (mode: boolean) => void,
    // getInputMode: () => boolean,
    rerender: () => void,
    update: () => void,

    clearStore: () => void,
}

export const createProjectStore = () => {
    const store: IProjectStore = {
        [projectSymbol]: null,
        [projectToLoadId]: "",
        [webSocketUpdaterSymbol]: null,
        [rerenderSymbol]: true,
        // [inputModeSymbol]: false,
        // [inputDataSymbol]: "",

        setProject(p: IProject) {
            this[projectSymbol] = p;
        },

        getProject() {
            return this[projectSymbol];
        },

        setProjectToLoadId(id: string) {
            this[projectToLoadId] = ' ';
            this[webSocketUpdaterSymbol]!();
            this[projectToLoadId] = id;
            this[webSocketUpdaterSymbol]!();
        },

        getProjectToLoadId() {
            return this[projectToLoadId];
        },

        setWebSocketUpdater(webSocketUpdater: () => void) {
            this[webSocketUpdaterSymbol] = webSocketUpdater;
        },

        // setInputData(val: string) {
        //     this[inputDataSymbol] = val;
        // },

        // getInputData() {
        //     return this[inputDataSymbol];
        // },

        // addInputKey(e: KeyboardEvent) {
        //     if (this.getInputMode() === true){
        //         if (e.key === 'Backspace'){
        //             this[inputDataSymbol] = this[inputDataSymbol].substring(0, this[inputDataSymbol].length-1);
        //         }
        //         if (e.key === 'Escape'){
        //             this[inputModeSymbol] = false; 
        //         }
        //         if (e.key !== 'Backspace' && e.key !== 'Escape' && e.key !== 'Enter' && e.key !== 'Home' && e.key !== 'Insert' && e.key !== 'End'){
        //             this[inputDataSymbol] = this[inputDataSymbol]+e.key;
        //         }
        //     }
        // },

        // setInputMode(mode: boolean){
        //     this[inputModeSymbol] = mode;
        // },

        // getInputMode(){
        //     return this[inputModeSymbol];
        // },

        rerender() {
            this[rerenderSymbol] = !this[rerenderSymbol];
        },

        update() {
            if (this[projectSymbol]) {
                const newProject = new Project(this[projectSymbol]!.getShapesGroups(),
                    this[projectSymbol]!.getTitle(),
                    this[projectSymbol]!.getID(),
                    this[projectSymbol]!.getPages());
                newProject.setIsLoading(false);
                this.setProject(newProject);
            }
        },

        clearStore() {
            this[projectSymbol] = null;
        }
    };

    return store
}

export type TProjectStore = ReturnType<typeof createProjectStore>