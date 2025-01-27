import Editor from "../../../../components/Editors/Editor";
import { EditorType } from "../../../../model/EditorType";
import "./propertyPanel.scss";

interface IPropertyPanelProps {
    property: {
        label: string,
        value: string,
        editor: EditorType
    }
    onChangeProperty: (value: string | string[]) => void,
}

const PropertyPanel = ({ property, onChangeProperty }: IPropertyPanelProps) => {
    return (
        <div key={property.value + property.label} className="property">
            <span className='property-title'>{property.label}</span>
            <Editor
                type={property.editor}
                field={property.label}
                defaultValue={property.value}
                valueRound={true}
                onChange={onChangeProperty}
            />
        </div>
    )
}

export default PropertyPanel;