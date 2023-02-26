import ILanguage from "./ILanguage";

export const ru: ILanguage = {
    loginPage: {
        rates: "Тарифы",
        aboutIn: "",
        contactWithDevelopers: "Связь с разработчиками",
        login: "Вход в систему",
        aboutTheProject: "О проекте",
        slog: 
        {
            first: "ИНЖЕНЕРАМИ",
            second: "ДЛЯ ИНЖЕНЕРОВ"
        },
        userForm: {
            forgotPassword: "Забыли пароль?",
            buttonStart: "НАЧНЕМ!",
            buttonRegister: "ЗАРЕГИСТРИРОВАТЬСЯ",
            register: "Регистрация",
            signIn: "Авторизация",
            password: "Пароль",
            passwordConfirmation: "Повторите пароль",
            requiredError: "Поле обязательно для ввода",
            emailError: "Некорректный email адрес",
            toLongEmailError: "Введено более 40 символов",
            toShortPassword: "Введено менее 4 символов",
            toLongPasswordError: "Введено более 20 символов",
            passwordsDoesNotMatch: "Пароли не совпадают",
            registrationEmailError: "Пользователь с таким e-mail уже существует",
            invalidUserError: "Пользователь не существует или не подтвержден",
            passwordError: "Неверный пароль"
        }
    },
    userPage: {
        projectTab: {
            defaultName: "Новый проект",
            justCreated: "Только что создан",
            owner: "Владелец",
            modified: "Последнее изменение",
            startNewProject: "Создать новый проект",
            deleteProjectQuestion: "Вы уверены что хотите удалить проект",
            delete: "Удалить",
            cancel: "Отмена"
        },
        settingsTab: {
            userInfo: {
                title: "ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ"
            },
            balance: {
                title: "БАЛАНС"
            },
            generalSettings: {
                title: "ОСНОВНЫЕ НАСТРОЙКИ",
                subtitle: "Настройки",
                language: "Язык",
                timezone: "Временная зона",
                password: "Пароль",
                change: "Изменить"
            },
            personalRate: {
                title: "ПЕРСОНАЛЬНЫЙ ТАРИФ"
            },
            organization: {
                title: "ВАША ОРГАНИЗАЦИЯ",
                subtitle: "Организация"
            },
            metrics: {
                title: "МЕТРИКИ",
                subtitle: "Статистика"
            }
        }
    }
}