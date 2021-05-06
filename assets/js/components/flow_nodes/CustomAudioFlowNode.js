import React, { useState } from 'react';
import { Handle } from 'react-flow-renderer';
import AudioNodeGraph from '../../AudioNodeGraph';

const nodeStyle = {
  background: "blue",
  display: "flex",
  flexDirection: "column"
}

const transformValue = (sliderAction, value) => {
  switch(sliderAction) {
    case "exp":
      return Math.pow(value, 2);
    case "cub":
      return Math.pow(value, 3);
    default:
      return value;
  }
}

const reverseTransformValue = (sliderAction, value) => {
  switch(sliderAction) {
    case "exp":
      return Math.sqrt(value);
    case "cub":
      return Math.cbrt(value);
    default:
      return value;
  }
}

const CustomAudioFlowNode = ({ id, data: { label, params, constants, outputs, inputs }}) => {
  // handle constants
  const initialState = params.reduce((initial, {name, sliderAction}) => {
    const audioNode = AudioNodeGraph.get(id);
    if (audioNode) {
      initial[name] = audioNode.parameters.get(name).value;
      initial[`${name}-slider`] = reverseTransformValue(sliderAction, audioNode.parameters.get(name).value);
    }
    return initial;
  }, {});

  const [state, setState] = useState(initialState);

  const slider = ({ name, min, max, sliderAction }) => {
    const sliderMax = reverseTransformValue(sliderAction, max);

    const onSlide = ({target: {value}}) => {
      const transformedValue = transformValue(sliderAction, parseFloat(value));
      const audioNode = AudioNodeGraph.get(id);
      audioNode.parameters.get(name).setValueAtTime(transformedValue, audioNode.context.currentTime);
      setState({...state, [name]: transformedValue, [`${name}-slider`]: value})
    }

    const onChange = ({target: {value}}) => {
      const audioNode = AudioNodeGraph.get(id);
      audioNode.parameters.get(name).setValueAtTime(value, audioNode.context.currentTime);
      const parsedValue = parseFloat(value) || 0;
      setState({...state, [name]: value, [`${name}-slider`]: reverseTransformValue(sliderAction, parsedValue)});
    }

    return (
      <div key={name} className={`controls param-${name}`}>
        <label>{name}</label>
        <div className="inputs">
          <input
            className="nodrag"
            type="range"
            min={min}
            max={sliderMax}
            step="0.01"
            value={state[`${name}-slider`]}
            onChange={onSlide}
            />
          <input
            value={state[name]}
            onChange={onChange}
          />
        </div>
      </div>
    )
  }

  const constant = ({name, options}) => {

    const onChange = ({ target: { value }}) => {
      const audioNode = AudioNodeGraph.get(id);
      audioNode[name] = value
    }

    return (
      <div key={name} className={`controls constant-${name}`}>
        <label>{name}</label>
        <div className="inputs">
          <select onChange={onChange} name={name}>
            {options.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
      </div>
    )
  }

  return(
    <div key={id} style={nodeStyle}>
      {inputs ? <Handle type="target" position="left" /> : ""}
      {params.map(({name}, idx) => <Handle type="target" key={name} id={name} position="top" style={{ left: `${(idx + 0.5)/params.length * 100}%`}}/>)}
      <div className="label">{label}</div>
      {params.map(slider)}
      {constants.map(constant)}
      {outputs ? <Handle type="source" position="right" /> : ""}
    </div>
  )
}

export default CustomAudioFlowNode;