import { LanguageData, useLanguageContext } from "../../../providers/languageProvider";
import { IShapeProps } from "../ProjectPage";
import { PropertyPanel } from "../../../components";
import { ChangeShapePropertyAction } from "../../../model/actions/ChangeShapePropertyAction";
import { TActionStore } from "../../../stores/actionStore";
import { useRootStore } from "../../../providers/rootProvider";
import { IGraphicalProperty, IShapeGraphicalProps } from "../../../model/shapes/IShape";

interface IGraphicalPropertiesPanelProps {
    // graphicalConfig: IShapeGraphicalProps | undefined,
    // size: {
    //     w: number,
    //     h: number,
    // } | undefined,
    shapeProps: IShapeProps | null,
    onChange: (props: IShapeGraphicalProps) => void
}

const GraphicalPropertiesPanel = ({ shapeProps, onChange }: IGraphicalPropertiesPanelProps) => {
    const lang: LanguageData | null = useLanguageContext();
    const actionStore: TActionStore = useRootStore().getActionStore();
    const currentLayer = useRootStore().getProjectStore().getProject()?.getCurrentPage()?.getCurrentLayer();

    return (
        <div id="graphicalPropertiesPanel">
            <p className="panel-title">
                <span>{lang?.langText.projectPage.graphPanel.title}</span>
            </p>
            {shapeProps && <div className="">
                {/* <PropertyPanel property={{ label: 'X', value: shapeProps?.graphProps.x.value ?? '' }}
                    onChange={val => shapeProps && (shapeProps.graphProps.x.value = val)}
                />
                <PropertyPanel property={{ label: 'Y', value: shapeProps?.graphProps.y.value ?? '' }}
                    onChange={val => shapeProps && (shapeProps.graphProps.y.value = val)}
                />
                <PropertyPanel property={{ label: lang?.langText.projectPage.graphPanel.width ?? '', value: shapeProps?.size?.w ?? '' }}
                    onChange={val => shapeProps && (shapeProps.size.w = parseInt(val))}
                />
                <PropertyPanel property={{ label: lang?.langText.projectPage.graphPanel.height ?? '', value: shapeProps?.size?.h ?? '' }}
                    onChange={val => shapeProps && (shapeProps.size.h = parseInt(val))}
                /> */}
                <div className="">
                    {
                        shapeProps && Object.entries(shapeProps.graphProps)
                            .filter(([key, obj]) => obj.isReadable)
                            .map(([key, obj]) =>
                                <PropertyPanel key={key + obj.label} property={{ label: obj.label, value: obj.value }}
                                    onChange={value => {
                                        const changableShape = currentLayer?.getShapes().find(shape => shape.config.id === shapeProps.id);
                                        const newProps = { ...shapeProps.graphProps, [key]: { ...obj, ...{ value } } }
                                        let changePropAction = new ChangeShapePropertyAction(
                                            changableShape!,
                                            currentLayer!.getID(),
                                            newProps
                                        );
                                        actionStore.push(changePropAction);
                                        onChange(newProps);
                                    }}
                                />
                            )
                    }
                </div>
            </div>}

        </div>
    )
}

export default GraphicalPropertiesPanel;