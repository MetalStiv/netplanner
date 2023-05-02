import Page from '../../../model/Page';
import { useState } from 'react';
import { LanguageData, useLanguageContext } from '../../../providers/languageProvider';
import titleUniqueization from '../../../common/helpers/titleUniquezation';


interface ILayersPanelProps {
    currentPage: Page,
    //updatePageCallback: (page: Page) => void,
}

const LayersPanel = ({ currentPage }: ILayersPanelProps) => {
    const [editingLayerIndex, setEditingLayerIndex] = useState<number>(-1);
    const [draggableLayerIndex, setDraggableLayerIndex] = useState<number>(-1);
    const [title, setTitle] = useState<string>("");

    const lang: LanguageData | null = useLanguageContext();

    const visibleIcon = <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.6849 9C11.6849 10.485 10.4849 11.685 8.99994 11.685C7.51494 11.685 6.31494 10.485 6.31494 9C6.31494 7.515 7.51494 6.315 8.99994 6.315C10.4849 6.315 11.6849 7.515 11.6849 9Z" stroke="#6B6B70" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.00013 15.2025C11.6476 15.2025 14.1151 13.6425 15.8326 10.9425C16.5076 9.885 16.5076 8.1075 15.8326 7.05C14.1151 4.35 11.6476 2.79 9.00013 2.79C6.35263 2.79 3.88513 4.35 2.16763 7.05C1.49263 8.1075 1.49263 9.885 2.16763 10.9425C3.88513 13.6425 6.35263 15.2025 9.00013 15.2025Z" stroke="#6B6B70" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>;

    const invisibleIcon = <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.8974 7.1025L7.10244 10.8975C6.61494 10.41 6.31494 9.7425 6.31494 9C6.31494 7.515 7.51494 6.315 8.99994 6.315C9.74244 6.315 10.4099 6.615 10.8974 7.1025Z" stroke="#6B6B70" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.3649 4.3275C12.0524 3.3375 10.5524 2.7975 8.99988 2.7975C6.35238 2.7975 3.88488 4.3575 2.16738 7.0575C1.49238 8.115 1.49238 9.8925 2.16738 10.95C2.75988 11.88 3.44988 12.6825 4.19988 13.3275" stroke="#6B6B70" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.31494 14.6475C7.16994 15.0075 8.07744 15.2025 8.99994 15.2025C11.6474 15.2025 14.1149 13.6425 15.8324 10.9425C16.5074 9.885 16.5074 8.1075 15.8324 7.05C15.5849 6.66 15.3149 6.2925 15.0374 5.9475" stroke="#6B6B70" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.6326 9.525C11.4376 10.5825 10.5751 11.445 9.51758 11.64" stroke="#6B6B70" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.1025 10.8975L1.5 16.5" stroke="#6B6B70" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.5 1.5L10.8975 7.1025" stroke="#6B6B70" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>;

    const changeTitleHandler = (el: HTMLInputElement, layerID: string) => {
        setEditingLayerIndex(-1);
        let newTitle = el.value.trim();

        if (newTitle.length) {
            newTitle = titleUniqueization(newTitle, currentPage.getLayers(), "234123413");

            currentPage.setLayers(currentPage.getLayers().map(item => {
                if (item.getID() === layerID) {
                    item.setTitle(newTitle);
                }
                return item;
            }))
            setTitle("");
        }
    }

    const inputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle((e.target as HTMLInputElement).value);
    }

    const layerOnDropHandler = (e: any, layerZIndex: number) => {
        e.stopPropagation();
        if (e.dataTransfer.getData("draggableElement") !== 'layer') {
            return;
        }
        let draggableLayerID = e.dataTransfer.getData("id");
        let draggableLayerZindex = currentPage.getLayers().find(item => item.getID() === draggableLayerID ? true : false)!.getZIndex();

        currentPage.setLayers(currentPage.getLayers().map(layerItem => {
            if (layerItem.getID() === draggableLayerID) {
                if (draggableLayerZindex < layerZIndex) {
                    layerItem.setZIndex(layerZIndex);
                }
                if (draggableLayerZindex > layerZIndex) {
                    layerItem.setZIndex(layerZIndex + 1000);
                }
            }
            return layerItem;
        }))
        currentPage.setLayers(currentPage.getLayers().map(layerItem => {
            // если перемещаем слой сверху вниз
            if (draggableLayerZindex < layerZIndex) {
                if (layerItem.getZIndex() > draggableLayerZindex && layerItem.getZIndex() <= layerZIndex && layerItem.getID() !== draggableLayerID) {
                    layerItem.setZIndex(layerItem.getZIndex() - 1000);
                }
            }
            // снизу вверх
            if (draggableLayerZindex > layerZIndex) {
                if (layerItem.getZIndex() > layerZIndex && layerItem.getZIndex() < draggableLayerZindex && layerItem.getID() !== draggableLayerID) {
                    layerItem.setZIndex(layerItem.getZIndex() + 1000);
                }
            }
            return layerItem;
        }))
        setDraggableLayerIndex(-1);
        //updatePageCallback(currentPage);
        //console.log(currentPage.getLayers())
    }


    return (
        <div id="layersPanel">
            <div className="panel-title-container">
                <p className="panel-title">
                    <span>{lang?.langText.projectPage.layersPanel.title}</span>
                    <span className="plus" onClick={() => {
                        currentPage.addLayer();
                        //updatePageCallback(currentPage);
                        setEditingLayerIndex(currentPage.getLayers().length - 1);
                    }}>
                        <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 6.5H11" stroke="#6B6B70" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 11.5V1.5" stroke="#6B6B70" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </p>
            </div>
            <div className="panel-content">
                {currentPage.getLayers().slice().sort((first, second) => first.getZIndex() - second.getZIndex()).map((layer, i) => (
                    <div key={layer.getTitle() + i} className="layer-container">
                        <div className={`dropzone top${draggableLayerIndex !== -1 && i === 0 && draggableLayerIndex !== 0 ? ' active' : ''}`} onDrop={e => layerOnDropHandler(e, -1000)} onDragOver={e => e.preventDefault()} ></div>

                        <div className={`layer${layer.getIsCurrent() ? ' current' : ''}`}
                            onClick={function () {
                                currentPage.setLayers(currentPage.getLayers().map(item => {
                                    if (item.getIsCurrent()) {
                                        item.setIsCurrent(false);
                                    }
                                    return item;
                                }))
                                //updatePageCallback(currentPage);
                                layer.setIsCurrent(true);
                            }}
                            draggable
                            onDragStart={e => {
                                setDraggableLayerIndex(i);
                                e.currentTarget.style.opacity = '0.5';

                                e.dataTransfer.effectAllowed = 'move';
                                e.dataTransfer.setData("draggableElement", 'layer');
                                e.dataTransfer.setData("id", '' + layer.getID());
                            }} onDragEnd={e => {
                                setDraggableLayerIndex(-1);
                                e.currentTarget.style.opacity = '1';
                            }} >
                            <div className='layer-icon'
                                onClick={function (e) {
                                    e.stopPropagation();
                                    currentPage.setLayers(currentPage.getLayers().map(item => {
                                        if (item.getID() === layer.getID()) {
                                            item.changeVisible(!item.getIsVisible());
                                        }
                                        return item;
                                    }))
                                    //updatePageCallback(currentPage);
                                }}>
                                {layer.getIsVisible() ? visibleIcon : invisibleIcon}
                            </div>
                            <span style={{ display: editingLayerIndex === i ? 'none' : 'inline' }}
                                className='layer-title'
                                onDoubleClick={() => {
                                    setEditingLayerIndex(i);
                                    setTitle(layer.getTitle());
                                }}>{layer.getTitle()}</span>
                            {
                                (editingLayerIndex === i) && <input
                                    className='change-name-input'
                                    autoFocus={true}
                                    type="text"
                                    onBlur={e => changeTitleHandler(e.target, layer.getID())}
                                    value={title}
                                    onChange={inputTitle}
                                    onKeyDown={e => {
                                        if (e.keyCode === 13) {
                                            changeTitleHandler(e.target, layer.getID());
                                        }
                                    }} />
                            }
                        </div>

                        <div className={`dropzone${draggableLayerIndex !== -1 && draggableLayerIndex !== i ? ' active' : ''}`} onDrop={e => layerOnDropHandler(e, layer.getZIndex())} onDragOver={e => e.preventDefault()} ></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LayersPanel;