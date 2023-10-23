import { useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { IEditorProps } from "../Editor";
import "./colorEditor.scss";

const ColorEditor = ({ defaultValue, field, onChange, textClassName = 'textEditor-text', inputClassName = 'color-picker-modal' }: IEditorProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [inputVal, setInputVal] = useState<string>(defaultValue.toString().toUpperCase());
    const [isValid, setIsValid] = useState<boolean>(true);
    const root: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

    const checkIsValid = (val: string) => {
        let reg = /^#([0-9a-f]{3}){1,2}$/i;
        const result = reg.test(val);
        setIsValid(result);
        return result;
    }

    const setVal = (val: string) => {
        let reg = /^#([0-9a-f]){0,}$/i;
        reg.test(val) && setInputVal(val.toUpperCase());
    }

    const changeProperty = () => {
        if (!checkIsValid(inputVal)) return;
        inputVal.length && onChange(inputVal);
        setIsEditing(false);
    }

    return (
        <div className="color-picker" ref={root}>
            <span
                className={textClassName}
                onClick={() => {
                    setIsEditing(true);
                }}>
                {defaultValue.toString().toUpperCase()}
            </span>
            {(
                isEditing && <div className={inputClassName}>
                    <HexColorPicker color={inputVal} onChange={val => setInputVal(val.toUpperCase())} />
                    <div className="color-examples">
                        <button className="example-white" onClick={() => setInputVal('#FFFFFF')}></button>
                        <button className="example-black" onClick={() => setInputVal('#000000')}></button>
                        <button className="example-red" onClick={() => setInputVal('#FF0000')}></button>
                        <button className="example-green" onClick={() => setInputVal('#00FF00')}></button>
                        <button className="example-blue" onClick={() => setInputVal('#0000FF')}></button>
                    </div>
                    <div className="hex-input">
                        <input
                            type="text"
                            value={inputVal.substring(1)}
                            onChange={e => setVal('#' + (e.target as HTMLInputElement).value)}
                            className={!isValid ? 'invalid' : ''}
                            minLength={3}
                            maxLength={6}
                        />
                    </div>
                    <div className="control-btns">
                        <button onClick={changeProperty} style={{ marginRight: 10 }} >OK</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </div>
            )
            }
        </div >)
}

export default ColorEditor;