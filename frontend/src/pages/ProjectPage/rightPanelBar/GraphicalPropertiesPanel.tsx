import { LanguageData, useLanguageContext } from "../../../providers/languageProvider";
import { IShapeProps } from "../ProjectPage";
import { ChangeShapePropertyAction } from "../../../model/actions/ChangeShapePropertyAction";
import { TActionStore } from "../../../stores/actionStore";
import { useRootStore } from "../../../providers/rootProvider";
import { GraphicalPropertyTypes, IGraphicalProperty, IShapeGraphicalProps } from "../../../model/shapes/IShape";
import Editor from "../../../components/Editors/Editor";
import { EditorType } from "../../../model/EditorType";
import ICanvasConfig from "../../../common/canvasConfig";
import { fromCartesianCoordSystem } from "../../../common/helpers/CartesianCoordSystem";

interface IGraphicalPropertiesPanelProps {
    shapeProps: IShapeProps | null,
    canvasProps: ICanvasConfig,
    onChange: (props: IShapeGraphicalProps) => void
}

const GraphicalPropertiesPanel = ({ shapeProps, onChange, canvasProps }: IGraphicalPropertiesPanelProps) => {
    const lang: LanguageData | null = useLanguageContext();
    const actionStore: TActionStore = useRootStore().getActionStore();
    const currentLayer = useRootStore().getProjectStore().getProject()?.getCurrentPage()?.getCurrentLayer();

    return (
        <div id="graphicalPropertiesPanel">
            <p className="panel-title">
                <span>{lang?.langText.projectPage.graphPanel.title}</span>
            </p>
            {shapeProps && <div className="panel-content">
                <div className="">
                    {
                        shapeProps && Object.entries(shapeProps.graphProps)
                            .filter(([key, obj]) => obj.isReadable)
                            .map(([key, obj]: [string, IGraphicalProperty]) =>
                                <div key={key + obj.label} className="property">
                                    <span className='property-title'>{obj.label}</span>
                                    <Editor
                                        type={obj.editorType}
                                        defaultValue={obj.value}
                                        textClassName="property-value"
                                        inputClassName={obj.editorType === EditorType.TEXT_EDITOR ? 'change-property-input' : undefined}
                                        onChange={value => {
                                            const changableShape = currentLayer?.getShapes().find(shape => shape.config.id === shapeProps.id);
                                            const convertedCoords = fromCartesianCoordSystem({
                                                x: +shapeProps.graphProps[GraphicalPropertyTypes.X].value,
                                                y: +shapeProps.graphProps[GraphicalPropertyTypes.Y].value
                                            }, canvasProps);
                                            const newProps = {
                                                ...shapeProps.graphProps,
                                                [GraphicalPropertyTypes.X]: { ...shapeProps.graphProps[GraphicalPropertyTypes.X], value: convertedCoords.x.toString() },
                                                [GraphicalPropertyTypes.Y]: { ...shapeProps.graphProps[GraphicalPropertyTypes.Y], value: convertedCoords.y.toString() },
                                                [key]: { ...obj, ...{ value } }
                                            }
                                            const changePropAction = new ChangeShapePropertyAction(
                                                changableShape!,
                                                currentLayer!.getID(),
                                                newProps
                                            );
                                            actionStore.push(changePropAction);
                                            onChange(newProps);
                                        }}
                                    />
                                </div>
                            )
                    }
                </div>
            </div>}
        </div>
    )
}

export default GraphicalPropertiesPanel;