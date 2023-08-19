import { useState } from 'react';
import "./rangeInput.scss"

interface IRangeInputProps {
    value: number,
    min: number,
    max: number,
    numberInputMin?: number,
    numberInputMax: number,
    step: number,
    onChange: (value: string) => void
}

const RangeInput: React.FC<IRangeInputProps> = ({ value, min, max, numberInputMin = 0,
    numberInputMax, step, onChange }) => {
    const [sliderTextInput, setSliderTextInput] = useState((value * 100).toString());

    return (
        <div className="scale-slider">
            <div className="slider-range">
                <div className="min">{min}%</div>
                <div className="max">{max}%</div>
                <input type="range"
                    className="slider-range-input"
                    min={min}
                    max={max}
                    step={step}
                    value={Math.ceil(value * 100)}
                    onChange={e => {
                        setSliderTextInput(e.target.value);
                        onChange(e.target.value);
                    }}
                />
            </div>
            <div className="slider-text">
                <input className="slider-text-input"
                    type="text"
                    value={sliderTextInput}
                    onInput={e => {
                        const curVal = e.currentTarget.value;
                        if (parseInt(curVal) <= numberInputMax || curVal === '') {
                            setSliderTextInput(parseInt(curVal) <= numberInputMin ? numberInputMin.toString() : curVal);
                        }
                    }}
                    onKeyDown={e => {
                        if (e.keyCode === 13) {
                            onChange(sliderTextInput)
                        }
                    }}
                />
                <label htmlFor="slider-text-input">%</label>
            </div>
        </div>
    )
}

export default RangeInput;