import React from 'react';
import Editor from '../../../components/Editors/Editor';
import { ChangeObjectPropertyAction } from '../../../model/actions/ChangeObjectPropertyAction';
import { EditorType } from '../../../model/EditorType';
import { IObjectProperty, IShapeObjectProps, ObjectPropertyTypes } from '../../../model/shapes/IShape';
import { LanguageData, useLanguageContext } from '../../../providers/languageProvider';
import { useRootStore } from '../../../providers/rootProvider';
import { TActionStore } from '../../../stores/actionStore';
import { IShapeProps } from '../ProjectPage'

interface IObjectPropertiesPanelProps {
    shapeProps: IShapeProps | null,
    onChange: (props: IShapeObjectProps) => void,
}

const ObjectPropertiesPanel = ({ shapeProps, onChange }: IObjectPropertiesPanelProps) => {
    const lang: LanguageData | null = useLanguageContext();
    const actionStore: TActionStore = useRootStore().getActionStore();
    const currentLayer = useRootStore().getProjectStore().getProject()?.getCurrentPage()?.getCurrentLayer();

    return (
        <div id="objectPropertiesPanel">
            <p className="panel-title">
                <span>{lang?.langText.projectPage.propertiesPanel.title}</span>
                <span className="plus" onClick={() => alert()}>
                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 6.5H11" stroke="#6B6B70" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 11.5V1.5" stroke="#6B6B70" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </p>
            {shapeProps && <div className="">
                <div className="property">
                    <p className='property-title'>{lang?.langText.projectPage.propertiesPanel.elType}</p>
                    <p className='property-value'>{lang?.langText.projectPage.baseShapes[shapeProps?.type] ?? ''}</p>
                </div>
            </div>}
            {
                shapeProps && Object.entries(shapeProps!.objectProps).map(([key, obj]: [string, IObjectProperty]) =>
                    <div className="property" key={key}>
                        <p className='property-title'>{lang?.langText.projectPage
                            .objectProperties[key as ObjectPropertyTypes]}</p>
                        {
                            <Editor
                                type={obj.editorType}
                                defaultValue={obj.value === "" ? "-" : obj.value}
                                valueRound={false}
                                textClassName="property-value"
                                inputClassName={obj.editorType === EditorType.TEXT_EDITOR ? 'change-property-input' : undefined}
                                onChange={value => {
                                    const changableShape = currentLayer?.getShapes().find(shape => shape.config.id === shapeProps.id);
                                    let newVal = value;
                                    const newProps = {
                                        ...shapeProps.objectProps,
                                        [key]: {...obj, value: newVal},
                                    };
                                    const changePropAction = new ChangeObjectPropertyAction(
                                        changableShape!,
                                        currentLayer!.getID(),
                                        newProps
                                    );
                                    console.log(changePropAction)
                                    actionStore.push(changePropAction);
                                    onChange(newProps);
                                }}
                            />
                            // <p className='property-value'>{obj.value}</p>
                        }
                    </div>
                )
            }
        </div>
    )
}

export default ObjectPropertiesPanel;