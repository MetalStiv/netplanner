import React, { useState } from 'react';
//import { useRootStore } from '../providers/rootProvider';

const LayersPanel: React.FC = () => {
    //const userStore = useRootStore()?.getUserStore()

    //const [collapsePanel1IsOpen, setCollapsePanel1IsOpen] = useState<boolean>(false);
    interface ILayer {
        index: number,
        isVisible: boolean,
        isCurrent: boolean,
    }
    const [layers, setLayers] = useState<ILayer[]>([{ index: 1, isVisible: true, isCurrent: true }]);
    //const [currentLayerIndex, setCurrentLayerIndex] = useState<number>(0);


    let visibleIcon = <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.6849 9C11.6849 10.485 10.4849 11.685 8.99994 11.685C7.51494 11.685 6.31494 10.485 6.31494 9C6.31494 7.515 7.51494 6.315 8.99994 6.315C10.4849 6.315 11.6849 7.515 11.6849 9Z" stroke="#6B6B70" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M9.00013 15.2025C11.6476 15.2025 14.1151 13.6425 15.8326 10.9425C16.5076 9.885 16.5076 8.1075 15.8326 7.05C14.1151 4.35 11.6476 2.79 9.00013 2.79C6.35263 2.79 3.88513 4.35 2.16763 7.05C1.49263 8.1075 1.49263 9.885 2.16763 10.9425C3.88513 13.6425 6.35263 15.2025 9.00013 15.2025Z" stroke="#6B6B70" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>;

    let invisibleIcon = <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.8974 7.1025L7.10244 10.8975C6.61494 10.41 6.31494 9.7425 6.31494 9C6.31494 7.515 7.51494 6.315 8.99994 6.315C9.74244 6.315 10.4099 6.615 10.8974 7.1025Z" stroke="#6B6B70" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M13.3649 4.3275C12.0524 3.3375 10.5524 2.7975 8.99988 2.7975C6.35238 2.7975 3.88488 4.3575 2.16738 7.0575C1.49238 8.115 1.49238 9.8925 2.16738 10.95C2.75988 11.88 3.44988 12.6825 4.19988 13.3275" stroke="#6B6B70" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6.31494 14.6475C7.16994 15.0075 8.07744 15.2025 8.99994 15.2025C11.6474 15.2025 14.1149 13.6425 15.8324 10.9425C16.5074 9.885 16.5074 8.1075 15.8324 7.05C15.5849 6.66 15.3149 6.2925 15.0374 5.9475" stroke="#6B6B70" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M11.6326 9.525C11.4376 10.5825 10.5751 11.445 9.51758 11.64" stroke="#6B6B70" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M7.1025 10.8975L1.5 16.5" stroke="#6B6B70" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M16.5 1.5L10.8975 7.1025" stroke="#6B6B70" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>;

    const addLayer = () => {
        setLayers(prev => [...prev, { index: layers[layers.length - 1].index + 1, isVisible: true, isCurrent: false }]);
    }

    //const toggle
    return (
        <div id="layersPanel">
            <p className="panel-title">
                <span>Layers</span>
                <div className="plus" onClick={() => addLayer()}>
                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 6.5H11" stroke="#6B6B70" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M6 11.5V1.5" stroke="#6B6B70" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
            </p>
            <div className="">
                {layers.map((layer, i) => (
                    <div className="layer-container">
                        <div className={`layer${layer.isCurrent ? ' current' : ''}`} onClick={function () {
                            setLayers(layers.map(item => {
                                if (item.isCurrent == true) {
                                    item.isCurrent = false;
                                }
                                return item;
                            }));
                            layer.isCurrent = true;
                        }}>
                            <div className='layer-icon' onClick={function (e) {
                                e.stopPropagation();
                                setLayers(layers.map(layer => {
                                    if (layer.index == i + 1) {
                                        layer.isVisible = !layer.isVisible;
                                    }
                                    return layer;
                                }))
                            }}>
                                {layer.isVisible ? visibleIcon : invisibleIcon}
                            </div>
                            <p className='layer-title'>{`Layer_${layer.index}`}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default LayersPanel;