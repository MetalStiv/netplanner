import { LanguageData, useLanguageContext } from "../../../providers/languageProvider";
import { IShapeProps } from "../ProjectPage";
import { PropertyPanel } from "../../../components";
import { ChangeShapePropertyAction } from "../../../model/actions/ChangeShapePropertyAction";
import { TActionStore } from "../../../stores/actionStore";
import { useRootStore } from "../../../providers/rootProvider";
import { IGraphicalProperty } from "../../../model/shapes/IShape";

interface IGraphicalPropertiesPanelProps {
    // graphicalConfig: IShapeGraphicalProps | undefined,
    // size: {
    //     w: number,
    //     h: number,
    // } | undefined,
    shapeProps: IShapeProps | null,
}

const GraphicalPropertiesPanel = ({ shapeProps }: IGraphicalPropertiesPanelProps) => {
    const lang: LanguageData | null = useLanguageContext();
    const actionStore: TActionStore = useRootStore().getActionStore();

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
                        shapeProps && Object.values(shapeProps.graphProps)
                            .filter((item: IGraphicalProperty) => item.isReadable)
                            .map((item: IGraphicalProperty, i: number) =>
                                <PropertyPanel key={i + item.label} property={{ label: item.label, value: item.value }}
                                    onChange={val => {

                                        // let changePropAction = new ChangeShapePropertyAction(item, item.value, val)
                                        // changePropAction.do() && app?.addAction(changePropAction);
                                        // item.value = val;
                                        // actionStore.push(changePropAction);
                                    }
                                    }
                                />
                            )
                    }
                </div>
            </div>}

        </div>
    )
}

export default GraphicalPropertiesPanel;