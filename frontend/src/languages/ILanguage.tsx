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
            subscribers: string,
            none: string,
            modified: string,
            startNewProject: string,
            deleteProjectQuestion: string,
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
    }
}

export default ILanguage