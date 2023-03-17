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
        }
    },
    projectPage: {
        shapesPanel: {
            title: "Элементы"
        },
        pagesPanel: {
            addBtn: "Добавить страницу"
        },
        layersPanel: {
            title: "Слои",
        },
        propertiesPanel: {
            title: "Свойства объекта",
            elType: "Тип элемента"
        },
        graphPanel: {
            title: "Графические свойства",
            width: "Ширина",
            height: "Высота",
        }
    },
    projectGroups: {
        polygons: {
            label: "Многоугольники",
            elements: {
                circle: "Окружность",
                rect: "Прямоугольник",
                ellipse: "Эллипс"
            }
        },
        primitives: {
            label: "Примитивы",
            elements: {
                line: "Отрезок",
                polyline: "Кривая",
                point: "Точка"
            }
        },
    }
}