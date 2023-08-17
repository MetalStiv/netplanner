import { GroupType } from "../model/shapes/GroupType";
import { GraphicalPropertyTypes } from "../model/shapes/IShape";
import { ShapeType } from "../model/shapes/ShapeType";
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
            changePasswordForm: {
                title: "Смена пароля",
                oldPassword: "Старый пароль",
                newPassword: "Новый пароль",
                passwordConfirmation: "Подтверждение пароля",
                wrongPassword: "Указан неверный текущий пароль",
                ok: "Пароль был обновлен",
                submit: "Сменить пароль",
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
        },
        updateModalHeader: "Обновлено до v",
    },
    projectPage: {
        notAllowed: "У вас нет прав доступа к проекту!",
        sharedButton: "Поделиться",
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
            elType: "Тип фигуры"
        },
        graphPanel: {
            title: "Графические свойства",
            width: "Ширина",
            height: "Высота",
        },
        baseGroups: {
            [GroupType.PRIMITIVES]: "Примитивы",
            [GroupType.BLOCK_DIAGRAM]: "Блок-схемы",
            [GroupType.FLOORPLAN]: "Планы зданий",
        },
        baseShapes: {
            [ShapeType.CIRCLE]: "Круг",
            [ShapeType.ELLIPS]: "Эллипс",
            [ShapeType.LINE]: "Линия",
            [ShapeType.POLYLINE]: "Ломанная",
            [ShapeType.RECTANGLE]: "Прямоугольник",
    
            [ShapeType.BEGIN_END]: "Начало-конец",
            [ShapeType.DECISION]: "Условие",
            [ShapeType.INPUT_OUTPUT]: "Ввод-вывод",
            [ShapeType.MODIFICATION]: "Модификация",
            [ShapeType.OPERATION]: "Операция",
            [ShapeType.PROCESS]: "Процесс",
            [ShapeType.REPEAT]: "Повторение",
    
            [ShapeType.BATH]: "Ванна",
            [ShapeType.DOOR]: "Дверь",
            [ShapeType.ROOM]: "Комната",
            [ShapeType.SHOWER_CABIN]: "Душевая кабина",
            [ShapeType.SINK]: "Раковина",
            [ShapeType.STAIR]: "Лестница",
            [ShapeType.STOVE]: "Плита",
            [ShapeType.TOILET]: "Туалет",
            [ShapeType.WALL]: "Стена",
            [ShapeType.WINDOW]: "Окно",
        },
        graphicalProperties: {
            [GraphicalPropertyTypes.X]: "X",
            [GraphicalPropertyTypes.Y]: "Y",
            [GraphicalPropertyTypes.X2]: "X2",
            [GraphicalPropertyTypes.Y2]: "Y2",
            [GraphicalPropertyTypes.R]: "R",
            [GraphicalPropertyTypes.RX]: "RX",
            [GraphicalPropertyTypes.RY]: "RY",
            [GraphicalPropertyTypes.WIDTH]: "Ширина",
            [GraphicalPropertyTypes.HEIGHT]: "Высота",
            [GraphicalPropertyTypes.PIVOT]: "Поворот",
            [GraphicalPropertyTypes.LEFT_WIDTH]: "Ширина левой стенки",
            [GraphicalPropertyTypes.RIGHT_WIDTH]: "Ширина правой стенки",
            [GraphicalPropertyTypes.TOP_WIDTH]: "Ширина верхней стенки",
            [GraphicalPropertyTypes.BOTTOM_WIDTH]: "Ширина нижней стенки",
        
            [GraphicalPropertyTypes.STROKE_COLOR]: "Цвет границы",
            [GraphicalPropertyTypes.STROKE_WIDTH]: "Толщина границы",
            [GraphicalPropertyTypes.STROKE_DASH]: "Тип границы",
        
            [GraphicalPropertyTypes.FILL_TYPE]: "Тип заливки",
            [GraphicalPropertyTypes.FILL_COLOR_ONE]: "Цвет заливки",
            [GraphicalPropertyTypes.FILL_COLOR_TWO]: "Дополнительный цвет заливки",
            [GraphicalPropertyTypes.FILL_HATCHING_SPACE]: "Размер шриховки",
            [GraphicalPropertyTypes.FILL_HATCHING_DASH]: "Тип штриховки",
        
            [GraphicalPropertyTypes.STEP_QUANTITY]: "Количество ступенек",
        },

        defaultPageName: "Страница",
        defaultLayerName: "Слой",
    },
}