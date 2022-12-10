import { IGraphProp } from "../../model/IShape";
import { IElemProps } from "./ProjectPage";

interface IGraphicalPropertiesPanelProps {
    // graphicalConfig: IShapeGraphicalProps | undefined,
    // size: {
    //     w: number,
    //     h: number,
    // } | undefined,
    elemProps: IElemProps | null,
}

interface IGraphProps {
    [index: string]: IGraphProp;
}

const GraphicalPropertiesPanel = ({ elemProps }: IGraphicalPropertiesPanelProps) => {
    return (
        <div id="graphicalPropertiesPanel">
            <p className="panel-title">
                <span>Graphical properties</span>
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
                    <p className='property-title'>X len</p>
                    <p className='property-value'>{elemProps?.size?.w ?? 0}</p>
                </div>
                <div className="property">
                    <p className='property-title'>Y len</p>
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