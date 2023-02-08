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
    }
}

export default ILanguage