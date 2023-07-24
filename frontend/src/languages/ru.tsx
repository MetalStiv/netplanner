import ILanguage from "./ILanguage";

export const ru: ILanguage = {
    headerMenu: {
        projects: "Проекты",
        settings: "Настройки",
        exit: "Выход",
        searchProject: "Поиск проекта...",
        noMessages: "Сообщений нет...",
        inviteTextProject: "хочет поделиться проектом",
        inviteTextGroup: "хочет поделиться группой",
        accept: "Принять",
        decline: "Отклонить",
    },
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
            passwordError: "Неверный пароль",
            emailSent: "НА ЭЛЕКТРОННУЮ ПОЧТУ ОТПРАВЛЕНО ПИСЬМО ДЛЯ ПОДТВЕРЖДЕНИЯ РЕГИСТРАЦИИ",
        }
    },
    userPage: {
        projectTab: {
            searchResult: "Результаты поиска",
            defaultName: "Новый проект",
            defaultPageName: "Страница",
            defaultLayerName: "Слой",
            defaultGroupName: "Новая группа",
            modified: "Обновлен",
            yearAbbreviation: "г",
            monthAbbreviation: "м",
            dayAbbreviation: "д",
            hourAbbreviation: "ч",
            minAbbreviation: "мин",
            lessThenAMinute: "менее минуты",
            ago: "назад",
            owner: "Владелец",
            subscribers: "Подписчики",
            none: "Нет",
            projects: "Проекты",
            startNewProject: "Создать новый проект",
            deleteProjectQuestion: "Вы уверены что хотите удалить проект",
            deleteProjectDefinition: "со всеми резервными данными",
            deleteGroupQuestion: "Вы уверены что хотите удалить группу",
            deleteGroupDefinition: "со всеми данными",
            delete: "Удалить",
            createCheckpoint: "Создать резерв",
            restoreFromCheckpoint: "Востановить из резерва",
            moveToGroup: "Поместить в группу",
            cancel: "Отмена",
            sharingForm: {
                title: "Общий доступ к ",
                readonly: "Только чтение",
                fullAccess: "Полный доступ",
                enterEmail: "Введите email",
                invite: "Пригласить",
                revoke: "Отозвать",
            },
            moveForm: {
                title: "Перемещение ",
                emptyGroupError: "Группа не была выбрана!",
            }
        },
        settingsTab: {
            userInfo: {
                title: "ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ",
                changePhoto: "Изменить фото"
            },
            balance: {
                title: "БАЛАНС",
                history: "История"
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
    },
    projectPage: {
        notAllowed: "У вас нет прав доступа к проекту!",
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
            shapes: {
                circle: "Окружность",
                rect: "Прямоугольник",
                ellipse: "Эллипс"
            }
        },
        primitives: {
            label: "Примитивы",
            shapes: {
                line: "Отрезок",
                polyline: "Кривая",
                point: "Точка"
            }
        },
    }
}