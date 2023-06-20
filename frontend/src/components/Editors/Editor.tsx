// import { useEffect, useState } from "react";
import { EditorType } from "../../model/EditorType";
import TextEditor from "./TextEditor/TextEditor";
import ColorEditor from "./ColorEditor/ColorEditor";

export interface IEditorProps {
    defaultValue: string,
    onChange: (editText: string) => void,
    textClassName?: string,
    inputClassName?: string,
}

interface IEditorSwitcherProps extends IEditorProps {
    type: EditorType
}

const editors = [
    TextEditor,
    ColorEditor
]

const Editor = ({ defaultValue, onChange, textClassName, inputClassName, type }: IEditorSwitcherProps) => {
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

    return editor ? editor({ defaultValue, onChange, textClassName, inputClassName }) : <></>;
}

export default Editor;