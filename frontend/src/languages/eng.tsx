import { GroupType } from "../model/shapes/GroupType"
import { GraphicalPropertyTypes } from "../model/shapes/IShape"
import { ShapeType } from "../model/shapes/ShapeType"
import ILanguage from "./ILanguage"

export const eng: ILanguage = {
    headerMenu: {
        projects: "Projects",
        settings: "Settings",
        exit: "Exit",
        searchProject: "Search project...",
        noMessages: "No messages...",
        inviteTextProject: "shares with you project",
        inviteTextGroup: "shares with you group",
        accept: "Accept",
        decline: "Decline",
    },
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
            passwordError: "Wrong password",
            emailSent: "AN EMAIL HAS BEEN SENT TO YOU TO CONFIRM YOUR REGISTRATION",
        }
    },
    userPage: {
        projectTab: {
            searchResult: "Search result",
            defaultName: "New project",
            defaultPageName: "Page",
            defaultLayerName: "Layer",
            defaultGroupName: "New group",
            modified: "Modified",
            yearAbbreviation: "y",
            monthAbbreviation: "m",
            dayAbbreviation: "d",
            hourAbbreviation: "h",
            minAbbreviation: "min",
            lessThenAMinute: "less then a minute",
            ago: "ago",
            owner: "Owner",
            subscribers: "Subscribers",
            none: "None",
            projects: "Projects",
            startNewProject: "Start a new project",
            deleteProjectQuestion: "Are you shure you want to delete project",
            deleteProjectDefinition: "with all checkpoints",
            deleteGroupQuestion: "Are you shure you want to delete group",
            deleteGroupDefinition: "with all data",
            delete: "Delete",
            createCheckpoint: "Create checkpoint",
            restoreFromCheckpoint: "Restore from checkpoint",
            moveToGroup: "Move to group",
            cancel: "Cancel",            
            sharingForm: {
                title: "Share ",
                readonly: "Read only",
                fullAccess: "Full access",
                enterEmail: "Enter email",
                invite: "Invite",
                revoke: "Revoke"
            },
            moveForm: {
                title: "Move ",
                emptyGroupError: "No group was selected!",
            }
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
            changePasswordForm: {
                title: "Change password",
                oldPassword: "Old password",
                newPassword: "New password",
                passwordConfirmation: "Password confirmation",
                wrongPassword: "Incorrect current password",
                ok: "Password has been changed",
                submit: "Change password",
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
        },
        updateModalHeader: "Updated to v",
    },
    projectPage: {
        notAllowed: "You are not allowed to project!",
        sharedButton: "SHARE",
        shapesPanel: {
            title: "Shapes"
        },
        pagesPanel: {
            addBtn: "Add page"
        },
        layersPanel: {
            title: "Layers",
        },
        propertiesPanel: {
            title: "Object properties",
            elType: "Shape type"
        },
        graphPanel: {
            title: "Graphical properties",
            width: "X len",
            height: "Y len",
        },
        baseGroups: {
            [GroupType.PRIMITIVES]: "Primitives",
            [GroupType.BLOCK_DIAGRAM]: "Block diagram",
            [GroupType.FLOORPLAN]: "Floorplan",
        },
        baseShapes: {
            [ShapeType.CIRCLE]: "Circle",
            [ShapeType.ELLIPS]: "Ellips",
            [ShapeType.LINE]: "Line",
            [ShapeType.POLYLINE]: "Polyline",
            [ShapeType.RECTANGLE]: "Rectangle",
    
            [ShapeType.BEGIN_END]: "Begin-end",
            [ShapeType.DECISION]: "Decision",
            [ShapeType.INPUT_OUTPUT]: "Input-output",
            [ShapeType.MODIFICATION]: "Modification",
            [ShapeType.OPERATION]: "Operation",
            [ShapeType.PROCESS]: "Process",
            [ShapeType.REPEAT]: "Repeat",
    
            [ShapeType.BATH]: "Bath",
            [ShapeType.DOOR]: "Door",
            [ShapeType.ROOM]: "Room",
            [ShapeType.SHOWER_CABIN]: "Shower cabin",
            [ShapeType.SINK]: "Sink",
            [ShapeType.STAIR]: "Stair",
            [ShapeType.STOVE]: "Stove",
            [ShapeType.TOILET]: "Toilet",
            [ShapeType.WALL]: "Wall",
            [ShapeType.WINDOW]: "Window",
        },
        graphicalProperties: {
            [GraphicalPropertyTypes.X]: "X",
            [GraphicalPropertyTypes.Y]: "Y",
            [GraphicalPropertyTypes.X2]: "X2",
            [GraphicalPropertyTypes.Y2]: "Y2",
            [GraphicalPropertyTypes.R]: "R",
            [GraphicalPropertyTypes.RX]: "RX",
            [GraphicalPropertyTypes.RY]: "RY",
            [GraphicalPropertyTypes.WIDTH]: "Width",
            [GraphicalPropertyTypes.HEIGHT]: "Height",
            [GraphicalPropertyTypes.PIVOT]: "Pivot",
            [GraphicalPropertyTypes.LEFT_WIDTH]: "Left wall width",
            [GraphicalPropertyTypes.RIGHT_WIDTH]: "Right wall width",
            [GraphicalPropertyTypes.TOP_WIDTH]: "Top wall width",
            [GraphicalPropertyTypes.BOTTOM_WIDTH]: "Bottom wall width",
        
            [GraphicalPropertyTypes.STROKE_COLOR]: "Stroke color",
            [GraphicalPropertyTypes.STROKE_WIDTH]: "Stroke wirth",
            [GraphicalPropertyTypes.STROKE_DASH]: "Stroke dash",
        
            [GraphicalPropertyTypes.FILL_TYPE]: "Fill type",
            [GraphicalPropertyTypes.FILL_COLOR_ONE]: "Fill color",
            [GraphicalPropertyTypes.FILL_COLOR_TWO]: "Fill second color",
            [GraphicalPropertyTypes.FILL_HATCHING_SPACE]: "Fill hatching space",
            [GraphicalPropertyTypes.FILL_HATCHING_DASH]: "Fill hatching dash",
        
            [GraphicalPropertyTypes.STEP_QUANTITY]: "Step quantity",
        },

        defaultPageName: 'Page',
        defaultLayerName: 'Layer',
    },
}