// import { IGraphicalProperty } from "../../model/IShape";
// import { LanguageData, useLanguageContext } from "../../providers/languageProvider";
// import { IShapeProps } from "../../pages/ProjectPage/ProjectPage";
import { useState, useEffect } from "react";
import "./propertyPanel.scss";

interface IPropertyPanelProps {
    // graphicalConfig: IShapeGraphicalProps | undefined,
    // size: {
    //     w: number,
    //     h: number,
    // } | undefined,
    // graphProp: IGraphicalProperty,
    // origin: any,
    property: {
        label: string,
        value: string
    }
    onChange: (value: string) => void,
}

const PropertyPanel = ({ property, onChange }: IPropertyPanelProps) => {
    // const lang: LanguageData | null = useLanguageContext();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [inputVal, setInputVal] = useState<string>(property.value);

    const changeProperty = () => {
        inputVal.length && onChange(inputVal);
        setIsEditing(false);
    }

    useEffect(() => {
        setInputVal(property.value);
        return () => {
            setInputVal('')
        }
    }, []);

    return (
        <div key={property.value + property.label} className="property">
            <span className='property-title'>{property.label}</span>
            <span
                className='property-value'
                style={{ display: isEditing ? 'none' : 'inline' }}
                onClick={() => {
                    setIsEditing(true);
                }}>
                {property.value}
            </span>
            {
                (isEditing && <input
                    value={inputVal}
                    onChange={e => setInputVal((e.target as HTMLInputElement).value)}
                    onKeyDown={e => {
                        if (e.keyCode === 13) {
                            changeProperty()
                        }
                    }}
                    className='change-property-input'
                    autoFocus={true}
                    type="text"
                    onBlur={() => {
                        changeProperty()
                    }}
                />
                )
            }
        </div>
    )
}

export default PropertyPanel;