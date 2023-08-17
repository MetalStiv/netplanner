import { GroupType } from "../model/shapes/GroupType"
import { GraphicalPropertyTypes } from "../model/shapes/IShape"
import { ShapeType } from "../model/shapes/ShapeType"

interface ILanguage {
    headerMenu: {
        projects: string,
        settings: string,
        exit: string,
        searchProject: string,
        noMessages: string,
        inviteTextProject: string,
        inviteTextGroup: string,
        accept: string,
        decline: string,
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
            passwordError: string,
            emailSent: string,
        }
    },
    userPage: {
        projectTab: {
            searchResult: string,
            defaultName: string,
            defaultPageName: string,
            defaultLayerName: string,
            defaultGroupName: string,
            modified: string,
            yearAbbreviation: string,
            monthAbbreviation: string,
            dayAbbreviation: string,
            hourAbbreviation: string,
            minAbbreviation: string,
            lessThenAMinute: string,
            ago: string,
            owner: string,
            subscribers: string,
            none: string,
            projects: string,
            startNewProject: string,
            deleteProjectQuestion: string,
            deleteProjectDefinition: string,
            deleteGroupQuestion: string,
            deleteGroupDefinition: string,
            delete: string,
            createCheckpoint: string,
            restoreFromCheckpoint: string,
            moveToGroup: string,
            cancel: string,
            sharingForm: {
                title: string,
                readonly: string,
                fullAccess: string,
                enterEmail: string,
                invite: string,
                revoke: string,
            },
            moveForm: {
                title: string,
                emptyGroupError: string,
            }
        },
        settingsTab: {
            userInfo: {
                title: string,
                changePhoto: string,
            },
            balance: {
                title: string,
                history: string,
            },
            generalSettings: {
                title: string,
                subtitle: string,
                language: string,
                timezone: string,
                password: string,
                change: string,
            },
            changePasswordForm: {
                title: string,
                oldPassword: string,
                newPassword: string,
                passwordConfirmation: string,
                wrongPassword: string,
                ok: string,
                submit: string,
            }
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
        },
        updateModalHeader: string,
    },
    projectPage: {
        notAllowed: string,
        sharedButton: string,
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
        },
        baseGroups: {
            [GroupType.PRIMITIVES]: string,
            [GroupType.BLOCK_DIAGRAM]: string,
            [GroupType.FLOORPLAN]: string,
        },
        baseShapes: {
            [ShapeType.CIRCLE]: string,
            [ShapeType.ELLIPS]: string,
            [ShapeType.LINE]: string,
            [ShapeType.POLYLINE]: string,
            [ShapeType.RECTANGLE]: string,
    
            [ShapeType.BEGIN_END]: string,
            [ShapeType.DECISION]: string,
            [ShapeType.INPUT_OUTPUT]: string,
            [ShapeType.MODIFICATION]: string,
            [ShapeType.OPERATION]: string,
            [ShapeType.PROCESS]: string,
            [ShapeType.REPEAT]: string,
    
            [ShapeType.BATH]: string,
            [ShapeType.DOOR]: string,
            [ShapeType.ROOM]: string,
            [ShapeType.SHOWER_CABIN]: string,
            [ShapeType.SINK]: string,
            [ShapeType.STAIR]: string,
            [ShapeType.STOVE]: string,
            [ShapeType.TOILET]: string,
            [ShapeType.WALL]: string,
            [ShapeType.WINDOW]: string,
        },
        graphicalProperties: {
            [GraphicalPropertyTypes.X]: string,
            [GraphicalPropertyTypes.Y]: string,
            [GraphicalPropertyTypes.X2]: string,
            [GraphicalPropertyTypes.Y2]: string,
            [GraphicalPropertyTypes.R]: string,
            [GraphicalPropertyTypes.RX]: string,
            [GraphicalPropertyTypes.RY]: string,
            [GraphicalPropertyTypes.WIDTH]: string,
            [GraphicalPropertyTypes.HEIGHT]: string,
            [GraphicalPropertyTypes.PIVOT]: string,
            [GraphicalPropertyTypes.LEFT_WIDTH]: string,
            [GraphicalPropertyTypes.RIGHT_WIDTH]: string,
            [GraphicalPropertyTypes.TOP_WIDTH]: string,
            [GraphicalPropertyTypes.BOTTOM_WIDTH]: string,
        
            [GraphicalPropertyTypes.STROKE_COLOR]: string,
            [GraphicalPropertyTypes.STROKE_WIDTH]: string,
            [GraphicalPropertyTypes.STROKE_DASH]: string,
        
            [GraphicalPropertyTypes.FILL_TYPE]: string,
            [GraphicalPropertyTypes.FILL_COLOR_ONE]: string,
            [GraphicalPropertyTypes.FILL_COLOR_TWO]: string,
            [GraphicalPropertyTypes.FILL_HATCHING_SPACE]: string,
            [GraphicalPropertyTypes.FILL_HATCHING_DASH]: string,
        
            [GraphicalPropertyTypes.STEP_QUANTITY]: string,
        },

        defaultPageName: string,
        defaultLayerName: string,
    },
}

export default ILanguage