import { useEffect, useState } from 'react';
import { TProjectStore } from '../../stores/projectStore';
import { useRootStore } from '../../providers/rootProvider';
import { TSvgInputStore } from '../../stores/svgInputStore';
import { TActionStore } from '../../stores/actionStore';
import { ChangeObjectPropertyAction } from '../../model/actions/ChangeObjectPropertyAction';
import Text from '../../model/shapes/primitiveShapes/Text';
import { ObjectPropertyTypes } from '../../model/shapes/IShape';

interface ISvgTextInputProps {
    keyVal: string,
    x: string,
    y: string,
    value: string,
    shape: Text,
    onExit: () => void,
}

const SvgTextInputProps: React.FC<ISvgTextInputProps> = ({ keyVal, x, y, value, shape, onExit }) => {
    const [flashed, setFlashed] = useState<boolean>(true);

    const svgInputStore: TSvgInputStore = useRootStore().getSvgInputStore();
    const actionStore: TActionStore = useRootStore().getActionStore();

    useEffect(() => {
        const interval = setInterval(() => {
            setFlashed(flashed => !flashed);
        }, 400);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        svgInputStore.setInputMode(true);
        svgInputStore.setInputData(value);
        return () => {
            svgInputStore.setInputMode(false);
            if (svgInputStore.getSaveMode()){
                shape.config.objectProperties[ObjectPropertyTypes.TEXT]!.value = svgInputStore.getInputData();
                actionStore.push(new ChangeObjectPropertyAction(shape, '', shape.config.objectProperties));
                onExit();
            }
            else{
                onExit();
            }
        };
    }, []);

    useEffect(() => {
        if (svgInputStore.getInputMode() === false){
            onExit();
        }
    }, [svgInputStore.getInputMode()])

    return <text
        tabIndex={-1}
        key={keyVal}
        x={x}
        y={y}
        filter='none'
    >
        {flashed ? svgInputStore.getInputData() + '|' : svgInputStore.getInputData()}
    </text>
}

export default SvgTextInputProps;