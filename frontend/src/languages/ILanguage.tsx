interface ILanguage {
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
            defaultName: string,
            justCreated: string,
            owner: string,
            modified: string,
            startNewProject: string,
            deleteProjectQuestion: string,
            delete: string,
            cancel: string
        }
    },
    projectPage: {
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
            elements: {
                circle: string,
                rect: string,
                ellipse: string
            }
        },
        primitives: {
            label: string,
            elements: {
                line: string,
                polyline: string,
                point: string
            }
        }
    }
}

export default ILanguage