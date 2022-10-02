export const createProjectStore = () => {
    const store = {
        get allElements() {
            return ['one', 'two'];
        },
    };

    return store
}

export type TProgectStore = ReturnType<typeof createProjectStore>