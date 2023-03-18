import { IGraphProp } from "../../../model/IShape";
import { LanguageData, useLanguageContext } from "../../../providers/languageProvider";
import { IElemProps } from "../ProjectPage";

interface IGraphicalPropertiesPanelProps {
    // graphicalConfig: IShapeGraphicalProps | undefined,
    // size: {
    //     w: number,
    //     h: number,
    // } | undefined,
    elemProps: IElemProps | null,
}

// interface IGraphProps {
//     [index: string]: IGraphProp;
// }

const GraphicalPropertiesPanel = ({ elemProps }: IGraphicalPropertiesPanelProps) => {
    const lang: LanguageData | null = useLanguageContext();

    return (
        <div id="graphicalPropertiesPanel">
            <p className="panel-title">
                <span>{lang?.langText.projectPage.graphPanel.title}</span>
            </p>
            <div className="">
                <div className="property">
                    <p className='property-title'>X</p>
                    <p className='property-value'>{elemProps?.graphProps.x.value ?? 0}</p>
                </div>
                <div className="property">
                    <p className='property-title'>Y:</p>
                    <p className='property-value'>{elemProps?.graphProps.y.value ?? 0}</p>
                </div>
                <div className="property">
                    <p className='property-title'>{lang?.langText.projectPage.graphPanel.width}</p>
                    <p className='property-value'>{elemProps?.size?.w ?? 0}</p>
                </div>
                <div className="property">
                    <p className='property-title'>{lang?.langText.projectPage.graphPanel.height}</p>
                    <p className='property-value'>{elemProps?.size?.h ?? 0}</p>
                </div>
                <div className="">
                    {
                        elemProps && Object.values(elemProps.graphProps)
                            .filter((item: IGraphProp) => {
                                return item.isReadable ? true : false;
                            })
                            .map((item: IGraphProp, i) => {
                                return <div key={item.value + item.label + i} className="property">
                                    <p className='property-title'>{item.label}</p>
                                    <p className='property-value'>{item.value}</p>
                                </div>
                            })
                    }
                    {/* {elemProps?.graphProps.otherPropertiesView?.map(prop => {
                        return <div className="property">
                            <p className='property-title'>{prop.title}</p>
                            <p className='property-value'>{prop.value}</p>
                        </div>
                    })} */}
                </div>
            </div>

        </div>
    )
}

export default GraphicalPropertiesPanel;