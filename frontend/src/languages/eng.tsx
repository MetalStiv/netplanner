import ILanguage from "./ILanguage"

export const eng: ILanguage = {
    loginPage: {
        rates: "Rates",
        aboutIn: "",
        contactWithDevelopers: "Contact with developers",
        login: "Login",
        aboutTheProject: "About the project",
        slog: 
        {
            first: "FROM ENGINEERS",
            second: "TO ENGINEERS"
        },
        userForm: {
            forgotPassword: "Forgot password?",
            buttonStart: "LET'S START",
            buttonRegister: "REGISTER",
            register: "Register",
            signIn: "Sign in",
            password: "Password",
            passwordConfirmation: "Password again",
            requiredError: "It is required field",
            emailError: "Invalid email address",
            toLongEmailError: "It is more then 40 symbols",
            toShortPassword: "It is less then 4 symbols",
            toLongPasswordError: "It is more then 20 symbols",
            passwordsDoesNotMatch: "Passwords does not match",
            registrationEmailError: "Email is already used",
            invalidUserError: "User doesn't registred",
            passwordError: "Wrong password"
        }
    },
    userPage: {
        projectTab: {
            defaultName: "New project",
            justCreated: "Just created",
            owner: "Owner",
            subscribers: "Subscribers",
            none: "None",
            modified: "Modified",
            startNewProject: "Start a new project",
            deleteProjectQuestion: "Are you shure you want to delete project",
            delete: "Delete",
            createCheckpoint: "Create checkpoint",
            restoreFromCheckpoint: "Restore from checkpoint",
            moveToGroup: "Move to group",
            cancel: "Cancel"
        },
        settingsTab: {
            userInfo: {
                title: "USER INFO",
                changePhoto: "Change photo"
            },
            balance: {
                title: "BALANCE",
                history: "History"
            },
            generalSettings: {
                title: "GENERAL SETTINGS",
                subtitle: "Settings",
                language: "Language",
                timezone: "Time zone",
                password: "Password",
                change: "Change"
            },
            personalRate: {
                title: "YOUR PERSONAL RATE"
            },
            organization: {
                title: "YOUR ORGANIZATION",
                subtitle: "Organization",
            },
            metrics: {
                title: "METRICS",
                subtitle: "Statistics",
            }
        }
    }
}