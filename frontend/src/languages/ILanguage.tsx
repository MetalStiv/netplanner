interface ILanguage {
    headerMenu: {
        projects: string,
        settings: string,
        exit: string,
        searchProject: string,
    },
    loginPage: {
        rates: string,
        aboutIn: string,
        contactWithDevelopers: string,
        login: string,
        aboutTheProject: string,
        slog: {
            first: string,
            second: string
        },
        userForm: {
            forgotPassword: string,
            buttonStart: string,
            buttonRegister: string,
            register: string,
            signIn: string,
            password: string,
            passwordConfirmation: string,
            requiredError: string,
            emailError: string,
            toLongEmailError: string,
            toShortPassword: string,
            toLongPasswordError: string,
            passwordsDoesNotMatch: string,
            registrationEmailError: string,
            invalidUserError: string,
            passwordError: string
        }
    },
    userPage: {
        projectTab: {
            searchResult: string,
            defaultName: string,
            defaultGroupName: string,
            justCreated: string,
            owner: string,
            subscribers: string,
            none: string,
            projects: string,
            modified: string,
            startNewProject: string,
            deleteProjectQuestion: string,
            deleteProjectDefinition: string,
            deleteGroupQuestion: string,
            deleteGroupDefinition: string,
            delete: string,
            createCheckpoint: string,
            restoreFromCheckpoint: string,
            moveToGroup: string,
            cancel: string
        },
        settingsTab: {
            userInfo: {
                title: string,
                changePhoto: string
            },
            balance: {
                title: string,
                history: string
            },
            generalSettings: {
                title: string,
                subtitle: string,
                language: string,
                timezone: string,
                password: string,
                change: string
            },
            personalRate: {
                title: string
            },
            organization: {
                title: string,
                subtitle: string,
            },
            metrics: {
                title: string,
                subtitle: string,
            }
        }
    },
    projectPage: {
        notAllowed: string,
        shapesPanel: {
            title: string
        },
        pagesPanel: {
            addBtn: string
        },
        layersPanel: {
            title: string
        },
        propertiesPanel: {
            title: string,
            elType: string
        }
        graphPanel: {
            title: string,
            width: string,
            height: string
        }
    },
    projectGroups: {
        polygons: {
            label: string,
            shapes: {
                circle: string,
                rect: string,
                ellipse: string
            }
        },
        primitives: {
            label: string,
            shapes: {
                line: string,
                polyline: string,
                point: string
            }
        }
    }
}

export default ILanguage