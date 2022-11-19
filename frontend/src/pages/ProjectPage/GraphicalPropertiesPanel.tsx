interface IGraphicalPropertiesPanelProps {
    elemGraphProps: {
        coords: {
            x: number,
            y: number,
        } | undefined,
        size: {
            w: number,
            h: number,
        } | undefined,
    }
}

const GraphicalPropertiesPanel = (props: IGraphicalPropertiesPanelProps) => {
    return (
        <div id="graphicalPropertiesPanel">
            <p className="panel-title">
                <span>Graphical properties</span>
            </p>
            <div className="">
                <div className="property">
                    <p className='property-title'>X</p>
                    <p className='property-value'>{props.elemGraphProps.coords?.x ?? 0}</p>
                </div>
                <div className="property">
                    <p className='property-title'>Y:</p>
                    <p className='property-value'>{props.elemGraphProps.coords?.y ?? 0}</p>
                </div>
                <div className="property">
                    <p className='property-title'>X len</p>
                    <p className='property-value'>{props.elemGraphProps.size?.w ?? 0}</p>
                </div>
                <div className="property">
                    <p className='property-title'>Y len</p>
                    <p className='property-value'>{props.elemGraphProps.size?.h ?? 0}</p>
                </div>
            </div>

        </div>
    )
}

export default GraphicalPropertiesPanel;