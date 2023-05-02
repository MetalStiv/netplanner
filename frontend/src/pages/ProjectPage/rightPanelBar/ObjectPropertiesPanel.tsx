import React from 'react';
import { LanguageData, useLanguageContext } from '../../../providers/languageProvider';
import { IShapeProps } from '../ProjectPage'
import { PropertyPanel } from '../../../components';

interface IObjectPropertiesPanelProps {
    shapeProps: IShapeProps | null,
}

const ObjectPropertiesPanel = ({ shapeProps }: IObjectPropertiesPanelProps) => {
    const lang: LanguageData | null = useLanguageContext();

    return (
        <div id="objectPropertiesPanel">
            <p className="panel-title">
                <span>{lang?.langText.projectPage.propertiesPanel.title}</span>
                <span className="plus" onClick={() => alert()}>
                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 6.5H11" stroke="#6B6B70" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 11.5V1.5" stroke="#6B6B70" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </p>
            {shapeProps && <div className="">
                <PropertyPanel property={{ label: lang?.langText.projectPage.propertiesPanel.elType ?? '', value: shapeProps?.type ?? '' }}
                    onChange={val => shapeProps && (shapeProps.type = val)}
                />
                {/* <div className="">
                <div className="property">
                    <p className='property-title'>{lang?.langText.projectPage.propertiesPanel.elType}</p>
                    <p className='property-value'>{shapeProps?.type ?? ''}</p>
                </div>
            </div> */}
            </div>
            }
        </div>
    )
}

export default ObjectPropertiesPanel;