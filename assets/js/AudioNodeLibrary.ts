import { AudioNodeFlowInterface } from "./AudioNodeFlowInterface";

const AudioNodeLibrary:{ [index: string] : (ctx: AudioContext) => AudioNodeFlowInterface} = {
  oscillator: (ctx: AudioContext): AudioNodeFlowInterface => {
    const audioNode = ctx.createOscillator();
    audioNode.start();
    return new AudioNodeFlowInterface({ 
      audioNode, 
      label: "Oscillator", 
      params: [
        {
          name: "frequency", 
          min: 0, 
          max: 22000, 
          sliderAction: "exp"
        }
      ], 
      constants: [
        {
          name: "type", 
          options: ["sine", "square", "sawtooth", "triangle"]
        }
      ]
    });
  },
  output: (ctx: AudioContext): AudioNodeFlowInterface => {
    return new AudioNodeFlowInterface({
      audioNode: ctx.destination,
      label: "Output"
    });
  },
  gain: (ctx: AudioContext): AudioNodeFlowInterface => {
    const audioNode = ctx.createGain();
    return new AudioNodeFlowInterface({
      audioNode,
      label: "Gain",
      params: [{ name: "gain", min: 0, max: 22000, sliderAction: "exp"}]
    });
  },
  constant: (ctx: AudioContext): AudioNodeFlowInterface => {
    const audioNode = ctx.createConstantSource();
    audioNode.start();
    return new AudioNodeFlowInterface({
      audioNode,
      label: "Constant",
      params: [{ name: "offset", min: 0, max: 22000, sliderAction: "exp"}]
    })
  },
  filter: (ctx: AudioContext): AudioNodeFlowInterface => {
    const audioNode = ctx.createBiquadFilter();
    return new AudioNodeFlowInterface({
      audioNode,
      label: "Filter",
      params: [
        {
          name: "frequency",
          min: 0,
          max: 22000,
          sliderAction: "exp"
        }, {
          name: "Q",
          min: 0,
          max: 10
        }, {
          name: "gain",
          min: 0,
          max: 10
        }],
      constants: [
        {
          name: "type",
          options: ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"]
        }
      ]
    });
  },
  delay: (ctx: AudioContext): AudioNodeFlowInterface => {
    const audioNode = ctx.createDelay();
    return new AudioNodeFlowInterface({
      audioNode,
      label: "Delay",
      params: [
        { 
          name: "delayTime",
          min: 0,
          max: 1,
          sliderAction: "exp"
        }
      ]
    })
  },
  pan: (ctx: AudioContext): AudioNodeFlowInterface => {
    const audioNode = ctx.createStereoPanner();
    return new AudioNodeFlowInterface({
      audioNode,
      label: "Stereo Panner",
      params: [
        {
          name: "pan",
          min: -1,
          max: 1
        }
      ]
    })
  }
}

export default AudioNodeLibrary