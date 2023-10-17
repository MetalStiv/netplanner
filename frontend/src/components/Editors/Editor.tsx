// import { useEffect, useState } from "react";
import { EditorType } from "../../model/EditorType";
import TextEditor from "./TextEditor/TextEditor";
import ColorEditor from "./ColorEditor/ColorEditor";

export interface IEditorProps {
    defaultValue: string,
    valueRound: boolean
    onChange: (editText: string) => void,
    textClassName?: string,
    inputClassName?: string,
}

interface IEditorSwitcherProps extends IEditorProps {
    type: EditorType
}

// const editors = [
//     TextEditor,
//     ColorEditor
// ]

const Editor = ({ defaultValue, valueRound, onChange, textClassName, inputClassName, type }: IEditorSwitcherProps) => {
    let editor: React.FC<IEditorProps> | null = null;

    switch (type) {
        case EditorType.TEXT_EDITOR:
            editor = TextEditor;
            break;
        case EditorType.COLOR_EDITOR:
            editor = ColorEditor;
            break;

        default:
            editor = null;
            break;
    }

    return valueRound ? 
        editor ? editor({ defaultValue: !isNaN(+defaultValue) ? Math.round(+defaultValue).toString() : defaultValue, valueRound, onChange, textClassName, inputClassName }) : <></>
        : editor ? editor({ defaultValue: defaultValue, valueRound, onChange, textClassName, inputClassName }) : <></>;
}

export default Editor;