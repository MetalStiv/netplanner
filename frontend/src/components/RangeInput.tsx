import React from 'react';
import "./rangeInput.scss"

interface IRangeInputProps {
    value: string,
    min: number,
    max: number,
    numberInputMin: number,
    numberInputMax: number,
    step: number,
    onChange: (e: React.FormEvent<HTMLInputElement>) => void
}

const RangeInput: React.FC<IRangeInputProps> = ({value, min, max, numberInputMin, 
    numberInputMax, step, onChange}) => {    
    
    return (
        <div className="range-input-container">
            <input type="range" min={min} max={max} value={value} 
                step={step} className="range-input" onChange={onChange} />
            <input type="text" className="scale-input" value={value} 
                onChange={e => {
                    if (!isNaN(+e.currentTarget.value) 
                        && +e.currentTarget.value >= numberInputMin
                        && +e.currentTarget.value <= numberInputMax){
                        onChange(e)
                    }
                }} />
            <span className="percent">%</span>
        </div>
    )
}

export default RangeInput;