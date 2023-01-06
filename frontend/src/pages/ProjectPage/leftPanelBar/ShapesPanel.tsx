import React from 'react';
import { useRootStore } from '../../../providers/rootProvider';
import Dropdown from '../../../components/Dropdown';
import { IDraggableElemProps } from '../ProjectPage';
import IShapeCreator from '../../../model/IShapeCreator';

interface IShapesPanelProps {
    getCreatorOnDragCallback: (elemType: IShapeCreator) => void,
}

const ShapesPanel = ({ getCreatorOnDragCallback }: IShapesPanelProps) => {
    const projectStore = useRootStore()!.getProjectStore();

    return (
        <div id="shapesPanel">
            <p className="panel-title">Shapes</p>
            <div>
                {projectStore.getProjects().at(0)?.shapesGroups!.map(function (group, i) {
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