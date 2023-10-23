import { useTransition, animated } from '@react-spring/web';
import { useState } from "react";
import { LanguageData, useLanguageContext } from "../../../providers/languageProvider";
import { IEditorProps } from "../Editor";
import "./multitextEditor.scss";

const MultitextEditor = ({ defaultValue, field, onChange, textClassName, inputClassName}: IEditorProps) => {
    const lang: LanguageData | null = useLanguageContext();

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [inputVal, setInputVal] = useState<string>('');
    const [editId, setEditId] = useState<number>(-1);
    const [editVal, setEditVal] = useState<string>('');
    const [values, setValues] = useState<string[]>(Array.isArray(defaultValue) ? defaultValue : []);

    const transition = useTransition(isEditing, {
        from: {
            x: 0, 
            y: 800, 
            opacity: 0,
            config: {
                duration: 200
            }
        },
        enter: {
            x: 0, 
            y: 0, 
            opacity: 1,
            config: {
                duration: 200
            }
        },
        leave: {
            x: 0, 
            y: 800, 
            opacity: 0,
            config: {
                duration: 200
            }
        }
    });

    const addData = (data: string) => {
        onChange([...values, data])
        setValues(v => [...v, data])
        setInputVal('')
        setEditId(-1);
        setEditVal('');
    }

    const updateData = (ind: number, data: string) => {
        onChange([...values.slice(0, ind), data, ...values.slice(ind+1)])
        setValues(v => [...v.slice(0, ind), data, ...v.slice(ind+1)])

        setInputVal('')
        setEditId(-1);
        setEditVal('');
    }

    const deleteData = (ind: number) => {
        onChange([...values.slice(0, ind), ...values.slice(ind+1)]);
        setValues(v => [...v.slice(0, ind), ...v.slice(ind+1)]);
        setEditId(-1);
        setEditVal('');
    }

    return (<>
        <span
            className='show-btn'
            onClick={() => {
                setIsEditing(true);
            }}>
            {lang?.langText.projectPage.showButton}
        </span>
        {
            isEditing ?
                transition((style, item) => 
                    item &&
                    <div className="modal">
                        <div className="container" style={{marginTop: '30vh'}}>
                            <animated.div style={style} className="panel">

                                <div className="show-form-header">
                                    <div className="show-form-title">
                                        {field}
                                    </div>
                                    <div className="close-icon" onClick={() => setIsEditing(false)}>x
                                    </div>
                                </div>

                                <div className="option-position-row">
                                    <input
                                        value={inputVal}
                                        onChange={e => setInputVal((e.target as HTMLInputElement).value)}
                                        onKeyDown={e => {
                                            if (e.keyCode === 13) {
                                                addData(inputVal)
                                            }
                                        }}
                                        className={inputClassName}
                                        onFocus={() => {
                                            setEditId(-1);
                                            setEditVal('')
                                        }}
                                        autoFocus={true}
                                        type="text"
                                    />
                                    <button className="add-option-position-button" onClick={() => {
                                            addData(inputVal)
                                    }}>{lang?.langText.projectPage.addButton}</button>
                                </div>

                                {
                                    values.map((v, ind) => 
                                        ind === editId ?
                                            <div className="option-position-row" key={ind}>
                                                <input
                                                    value={editVal}
                                                    onChange={e => setEditVal((e.target as HTMLInputElement).value)}
                                                    onKeyDown={e => {
                                                        if (e.keyCode === 13) {
                                                            updateData(ind, editVal);
                                                        }
                                                    }}
                                                    className={inputClassName}
                                                    autoFocus={true}
                                                    type="text"
                                                />

                                                <button className="delete-option-position-button" onClick={() => 
                                                    deleteData(ind)
                                                }>{lang?.langText.userPage.projectTab.delete}</button>
                                            </div>
                                            : <div className="option-position-row" key={ind}>
                                                <div className="option-position" onClick={() => {
                                                    setEditId(ind);
                                                    setEditVal(v);
                                                }}>{v}</div>
                                                <button className="delete-option-position-button" onClick={() => 
                                                    deleteData(ind)
                                                }>{lang?.langText.userPage.projectTab.delete}</button>
                                            </div>
                                    )
                                }
                            </animated.div>
                        </div>
                    </div>
                )
            : ''
        }
    </>)
}

export default MultitextEditor;