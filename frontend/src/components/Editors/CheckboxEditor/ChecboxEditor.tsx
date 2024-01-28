import { useEffect, useState } from "react";
import { IEditorProps } from "../Editor";
// import "./checkEditor.scss";

const CheckboxEditor = ({ defaultValue, field, onChange, textClassName = 'textEditor-text', inputClassName = 'textEditor-input' }: IEditorProps) => {
    // const [isEditing, setIsEditing] = useState<boolean>(false);
    const [inputVal, setInputVal] = useState<boolean>(defaultValue.toString() === '1' ? true : false);

    const changeProperty = (res: boolean) => {
        setInputVal(res)
        onChange(res ? '1' : '0');
    }

    return <input
        checked={inputVal}
        onChange={e => changeProperty((e.target as HTMLInputElement).checked)}
        className={inputClassName}
        autoFocus={true}
        type="checkbox"
    />
}

export default CheckboxEditor;