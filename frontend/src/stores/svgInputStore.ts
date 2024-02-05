const inputModeSymbol: unique symbol = Symbol();
const inputDataSymbol: unique symbol = Symbol();
const inputSaveSymbol: unique symbol = Symbol()

interface ISvgInputStore {
    [inputDataSymbol]: string,
    [inputModeSymbol]: boolean,
    [inputSaveSymbol]: boolean,
    setInputData: (val: string) => void,
    getInputData: () => string,
    addInputKey: (e: KeyboardEvent) => void,
    setInputMode: (mode: boolean) => void,
    getInputMode: () => boolean,
    setSaveMode: (mode: boolean) => void,
    getSaveMode: () => boolean,

    clearStore: () => void,
}

export const createSvgInputStore = () => {
    const store: ISvgInputStore = {
        [inputModeSymbol]: false,
        [inputDataSymbol]: "",
        [inputSaveSymbol]: false,

        setInputData(val: string) {
            this[inputDataSymbol] = val;
        },

        getInputData() {
            return this[inputDataSymbol];
        },

        addInputKey(e: KeyboardEvent) {
            if (this.getInputMode() === true){
                if (e.key === 'Backspace'){
                    this[inputDataSymbol] = this[inputDataSymbol].substring(0, this[inputDataSymbol].length-1);
                }
                if (e.key === 'Escape'){
                    this[inputSaveSymbol] = false;
                    this[inputModeSymbol] = false; 
                }
                if (e.key === 'Enter'){
                    this[inputSaveSymbol] = true;
                    this[inputModeSymbol] = false; 
                }
                if (e.key !== 'Backspace' && e.key !== 'Escape' && e.key !== 'Enter' && e.key !== 'Home' && e.key !== 'Insert' && e.key !== 'End'){
                    this[inputDataSymbol] = this[inputDataSymbol]+e.key;
                }
            }
        },

        setInputMode(mode: boolean){
            this[inputModeSymbol] = mode;
        },

        getInputMode(){
            return this[inputModeSymbol];
        },

        setSaveMode(mode: boolean){
            this[inputSaveSymbol] = mode;
        },

        getSaveMode(){
            return this[inputSaveSymbol];
        },

        clearStore() {
            this[inputDataSymbol] = '';
        }
    };

    return store
}

export type TSvgInputStore = ReturnType<typeof createSvgInputStore>