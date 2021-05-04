import React, { useState } from 'react';
import { Handle } from 'react-flow-renderer';
import AudioNodeGraph from '../../AudioNodeGraph';

const nodeStyle = {
  background: "red",
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

const AudioFlowNode = ({ id, data: { label, params, constants, outputs, inputs }}) => {
  // handle constants
  // probably want to try to do special handling for frequency sliders (exponential)
  
  const initialState = params.reduce((initial, {name, sliderAction}) => {
    const audioNode = AudioNodeGraph.get(id);
    if (audioNode) {
      initial[name] = audioNode[name].value;
      initial[`${name}-slider`] = reverseTransformValue(sliderAction, audioNode[name].value);
    }
    return initial;
  }, {});

  const [state, setState] = useState(initialState);

  const slider = ({ name, min, max, sliderAction }) => {
    const sliderMax = reverseTransformValue(sliderAction, max);

    const onSlide = ({target: {value}}) => {
      const transformedValue = transformValue(sliderAction, parseFloat(value));
      const audioNode = AudioNodeGraph.get(id);
      audioNode[name].setValueAtTime(transformedValue, audioNode.context.currentTime);
      setState({...state, [name]: transformedValue, [`${name}-slider`]: value})
    }

    const onChange = ({target: {value}}) => {
      const audioNode = AudioNodeGraph.get(id);
      audioNode[name].setValueAtTime(value, audioNode.context.currentTime);
      setState({...state, [name]: parseFloat(value), [`${name}-slider`]: reverseTransformValue(sliderAction, value)});
    }

    return (
      <div key={name} className={`controls param-${name}`}>
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
          value={(state[name]).toFixed(2)}
          onChange={onChange}
        />
      </div>
    )
  }

  return(
    <div key={id} style={nodeStyle}>
      {inputs ? <Handle type="target" position="left" /> : ""}
      {params.map(({name}, idx) => <Handle type="target" key={name} id={name} position="top" style={{ left: `${(idx + 0.5)/params.length * 100}%`}}/>)}
      <div className="label">{label}</div>
      {params.map(slider)}
      {outputs ? <Handle type="source" position="right" /> : ""}
    </div>
  )
}

export default AudioFlowNode;