import { useEffect, useState } from "react";
import { IEditorProps } from "../Editor";
import "./textEditor.scss";

const TextEditor = ({ defaultValue, field, onChange, textClassName = 'textEditor-text', inputClassName = 'textEditor-input' }: IEditorProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [inputVal, setInputVal] = useState<string>(defaultValue.toString());

    const changeProperty = () => {
        inputVal.length && onChange(inputVal);
        setIsEditing(false);
    }

    return (<>
        <span
            className={textClassName}
            style={{ display: isEditing ? 'none' : 'inline' }}
            onClick={() => {
                setInputVal(defaultValue.toString())
                setIsEditing(true);
            }}>
            {defaultValue}
        </span>
        {(
            isEditing && <input
                value={inputVal}
                onChange={e => setInputVal((e.target as HTMLInputElement).value)}
                onKeyDown={e => {
                    if (e.keyCode === 13) {
                        changeProperty()
                    }
                }}
                className={inputClassName}
                autoFocus={true}
                type="text"
                onBlur={() => {
                    changeProperty()
                }}
            />
        )}
    </>)
}

export default TextEditor;