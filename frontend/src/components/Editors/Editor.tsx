// import { useEffect, useState } from "react";
import { EditorType } from "../../model/EditorType";
import TextEditor from "./TextEditor/TextEditor";
import ColorEditor from "./ColorEditor/ColorEditor";
import MultitextEditor from "./MultitextEditor/MultitextEditor";
import CheckboxEditor from "./CheckboxEditor/ChecboxEditor";

export interface IEditorProps {
    defaultValue: string | string[],
    field: string,
    valueRound: boolean
    onChange: (editText: string | string[]) => void,
    textClassName?: string,
    inputClassName?: string,
}

interface IEditorSwitcherProps extends IEditorProps {
    type: EditorType
}

const Editor = ({ defaultValue, field, valueRound, onChange, textClassName, inputClassName, type }: IEditorSwitcherProps) => {
    let editor: React.FC<IEditorProps> | null = null;

    switch (type) {
        case EditorType.TEXT_EDITOR:
            editor = TextEditor;
            break;
        case EditorType.COLOR_EDITOR:
            editor = ColorEditor;
            break;
        case EditorType.MULTITEXT_EDITOR:
            editor = MultitextEditor;
            break;
        case EditorType.CHECKBOX_EDITOR:
            editor = CheckboxEditor;
            break;

        default:
            editor = null;
            break;
    }

    return valueRound ? 
        editor ? editor({ defaultValue: !isNaN(+defaultValue) ? Math.round(+defaultValue).toString() : defaultValue, field, 
            valueRound, onChange, textClassName, inputClassName }) : <></>
        : editor ? editor({ defaultValue: defaultValue, field, valueRound, onChange, textClassName, inputClassName }) : <></>;
}

export default Editor;