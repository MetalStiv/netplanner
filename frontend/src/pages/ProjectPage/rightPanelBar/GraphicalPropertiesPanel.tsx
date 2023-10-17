import { LanguageData, useLanguageContext } from "../../../providers/languageProvider";
import { IShapeProps } from "../ProjectPage";
import { TActionStore } from "../../../stores/actionStore";
import { useRootStore } from "../../../providers/rootProvider";
import { GraphicalPropertyTypes, IGraphicalProperty, IShapeGraphicalProps } from "../../../model/shapes/IShape";
import Editor from "../../../components/Editors/Editor";
import { EditorType } from "../../../model/EditorType";
import ICanvasConfig from "../../../common/canvasConfig";
import { fromCartesianCoordSystem, toCartesianCoordSystem } from "../../../common/helpers/CartesianCoordSystem";
import { ChangeGraphicalPropertyAction } from "../../../model/actions/ChangeGraphicalPropertyAction";

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
                            .map(([key, obj]: [string, IGraphicalProperty]) => {
                                let incomingValue = obj.value;
                                if (key === GraphicalPropertyTypes.X || key === GraphicalPropertyTypes.Y) {
                                    const cartesianCoords = toCartesianCoordSystem({
                                        x: +shapeProps.graphProps[GraphicalPropertyTypes.X].value,
                                        y: +shapeProps.graphProps[GraphicalPropertyTypes.Y].value
                                    }, canvasProps);
                                    incomingValue = key === GraphicalPropertyTypes.X ? cartesianCoords.x.toString() : cartesianCoords.y.toString();
                                }
                                return <div key={key} className="property">
                                    <span className='property-title'>{lang?.langText.projectPage
                                        .graphicalProperties[key as GraphicalPropertyTypes]}</span>
                                    <Editor
                                        type={obj.editorType}
                                        defaultValue={incomingValue}
                                        valueRound={true}
                                        textClassName="property-value"
                                        inputClassName={obj.editorType === EditorType.TEXT_EDITOR ? 'change-property-input' : undefined}
                                        onChange={value => {
                                            const changableShape = currentLayer?.getShapes().find(shape => shape.config.id === shapeProps.id);
                                            let convertedCoords: { x: number, y: number } | null = null;
                                            let newVal = value;
                                            const isCoord = key === GraphicalPropertyTypes.X || key === GraphicalPropertyTypes.Y;
                                            if (isCoord) {
                                                convertedCoords = fromCartesianCoordSystem({
                                                    x: key === GraphicalPropertyTypes.X ? +value : 0,
                                                    y: key === GraphicalPropertyTypes.Y ? +value : 0
                                                }, canvasProps);
                                                newVal = key === GraphicalPropertyTypes.X ? convertedCoords.x.toString() : convertedCoords.y.toString();
                                            }
                                            // const graphProp = GraphicalPropertyTypes
                                            const newProps = {
                                                ...shapeProps.graphProps,
                                                [key]: { ...obj, value: changableShape!.validateProperty(newVal, key as GraphicalPropertyTypes) }
                                            };
                                            const changePropAction = new ChangeGraphicalPropertyAction(
                                                changableShape!,
                                                currentLayer!.getID(),
                                                newProps
                                            );
                                            console.log(changePropAction)
                                            actionStore.push(changePropAction);
                                            onChange(newProps);
                                        }}
                                    />
                                </div>
                            }
                        )
                    }
                </div>
            </div>}
        </div>
    )
}

export default GraphicalPropertiesPanel;