import React from 'react';
import { LanguageData, useLanguageContext } from '../../../providers/languageProvider';
import { IElemProps } from '../ProjectPage'


interface IObjectPropertiesPanelProps {
    elemProps: IElemProps | null,
}

const ObjectPropertiesPanel = ({ elemProps }: IObjectPropertiesPanelProps) => {
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
            <div className="">
                <div className="property">
                    <p className='property-title'>{lang?.langText.projectPage.propertiesPanel.elType}</p>
                    <p className='property-value'>{elemProps?.type ?? ''}</p>
                </div>
            </div>

        </div>
    )
}

export default ObjectPropertiesPanel;