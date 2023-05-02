import React from 'react';
import { useRootStore } from '../../../providers/rootProvider';
import { Dropdown } from '../../../components';
//import { IDraggableShapeProps } from '../ProjectPage';
import IShapeCreator from '../../../model/IShapeCreator';
import { LanguageData, useLanguageContext } from '../../../providers/languageProvider';

interface IShapesPanelProps {
    getCreatorOnDragCallback: (shapeType: IShapeCreator) => void,
}

const ShapesPanel = ({ getCreatorOnDragCallback }: IShapesPanelProps) => {
    const projectStore = useRootStore()!.getProjectStore();
    const lang: LanguageData | null = useLanguageContext();

    return (
        <div id="shapesPanel">
            <p className="panel-title">{lang?.langText.projectPage.shapesPanel.title}</p>
            <div>
                {projectStore.getProject()?.shapesGroups!.map(function (group, i) {
                    return (
                        <Dropdown key={group.title + i} title={group.title}>
                            <ul className='collapse-group'>
                                {group.shapes.map(function (creator, i) {
                                    return <li
                                        key={creator.type + i}
                                        className='collapse-item'
                                        draggable
                                        data-type={creator.type}
                                        onDragStart={e => {
                                            getCreatorOnDragCallback(creator);
                                            e.dataTransfer.setData("draggableElement", 'shape');
                                        }}>
                                        {creator.type}
                                    </li>
                                })}
                            </ul>
                        </Dropdown>
                    )
                })}
            </div>
        </div>
    )
}

export default ShapesPanel;