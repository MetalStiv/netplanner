import { IGraphProp } from "../../../model/IShape";
import { LanguageData, useLanguageContext } from "../../../providers/languageProvider";
import { IElemProps } from "../ProjectPage";
import { PropertyPanel } from "../../../components";
import { ApplicationData, useApplicationContext } from '../../../providers/applicationProvider';
import { ChangeShapePropertyAction } from "../../../model/Action";

interface IGraphicalPropertiesPanelProps {
    // graphicalConfig: IShapeGraphicalProps | undefined,
    // size: {
    //     w: number,
    //     h: number,
    // } | undefined,
    elemProps: IElemProps | null,
}

const GraphicalPropertiesPanel = ({ elemProps }: IGraphicalPropertiesPanelProps) => {
    const lang: LanguageData | null = useLanguageContext();
    const app: ApplicationData | null = useApplicationContext();

    return (
        <div id="graphicalPropertiesPanel">
            <p className="panel-title">
                <span>{lang?.langText.projectPage.graphPanel.title}</span>
            </p>
            {elemProps && <div className="">
                {/* <PropertyPanel property={{ label: 'X', value: elemProps?.graphProps.x.value ?? '' }}
                    onChange={val => elemProps && (elemProps.graphProps.x.value = val)}
                />
                <PropertyPanel property={{ label: 'Y', value: elemProps?.graphProps.y.value ?? '' }}
                    onChange={val => elemProps && (elemProps.graphProps.y.value = val)}
                />
                <PropertyPanel property={{ label: lang?.langText.projectPage.graphPanel.width ?? '', value: elemProps?.size?.w ?? '' }}
                    onChange={val => elemProps && (elemProps.size.w = parseInt(val))}
                />
                <PropertyPanel property={{ label: lang?.langText.projectPage.graphPanel.height ?? '', value: elemProps?.size?.h ?? '' }}
                    onChange={val => elemProps && (elemProps.size.h = parseInt(val))}
                /> */}
                <div className="">
                    {
                        elemProps && Object.values(elemProps.graphProps)
                            .filter((item: IGraphProp) => item.isReadable)
                            .map((item: IGraphProp, i: number) =>
                                <PropertyPanel key={i + item.label} property={{ label: item.label, value: item.value }}
                                    onChange={val => {
                                        let changePropAction = new ChangeShapePropertyAction(item, item.value, val)
                                        changePropAction.do() && app?.addAction(changePropAction);
                                        // item.value = val;

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