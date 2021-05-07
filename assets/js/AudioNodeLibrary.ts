import { AudioNodeFlowInterface, AudioNodeLibraryEntry } from "./AudioNodeFlowInterface";

const AudioNodeLibrary:{ [index: string] : AudioNodeLibraryEntry } = {
  oscillator: {
    func: (ctx) => {
      const audioNode = ctx.createOscillator();
      audioNode.start();
      return audioNode;
    },
    flowData: new AudioNodeFlowInterface({
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
      ],
      outputs: 1
    })
  },
  output: {
    func: (ctx) => ctx.destination,
    flowData: new AudioNodeFlowInterface({
      label: "Output",
      inputs: 1
    })
  },
  gain: {
    func: (ctx) => ctx.createGain(),
    
    flowData: new AudioNodeFlowInterface({
      label: "Gain",
      params: [{ name: "gain", min: 0, max: 22000, sliderAction: "exp"}],
      inputs: 1,
      outputs: 1
    })
  },
  constant: {
    func: (ctx) => {
      const audioNode = ctx.createConstantSource();
      audioNode.start();
      return audioNode;
    },
    flowData: new AudioNodeFlowInterface({
      label: "Constant",
      params: [{ name: "offset", min: 0, max: 22000, sliderAction: "exp"}],
      outputs: 1
    })
  },
  filter: {
    func: (ctx) => ctx.createBiquadFilter(),
    flowData: new AudioNodeFlowInterface({
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
          min: -10,
          max: 10
        }],
      constants: [
        {
          name: "type",
          options: ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"]
        }
      ],
      inputs: 1,
      outputs: 1
    })
  },
  delay: {
    func: (ctx) => ctx.createDelay(),
    flowData: new AudioNodeFlowInterface({
      label: "Delay",
      params: [
        { 
          name: "delayTime",
          min: 0,
          max: 1,
          sliderAction: "exp"
        }
      ],
      inputs: 1,
      outputs: 1
    })
  },
  pan: {
    func: (ctx) => ctx.createStereoPanner(),
    flowData: new AudioNodeFlowInterface({
      label: "Stereo Panner",
      params: [
        {
          name: "pan",
          min: -1,
          max: 1
        }
      ],
      inputs: 1,
      outputs: 1
    })
  },
  sender: {
    func: (ctx) => ctx.createMediaStreamDestination(),
    flowData: new AudioNodeFlowInterface({
      label: "Sender",
      inputs: 1,
    })
  },
  receiver: {
    // this is a placeholder audioNode that will output silence,
    // the audioNode will be replaced when the connection happens
    func: (ctx) => ctx.createBufferSource(),
    flowData: new AudioNodeFlowInterface({
      label: "Receiver",
      outputs: 1,
    })
  },
  noise: {
    func: (ctx) => new AudioWorkletNode(ctx, 'white_noise_processor'),
    flowData: new AudioNodeFlowInterface({
      label: "Noise",
      outputs: 1
    })
  },
  digitalNoise: {
    func: (ctx) => new AudioWorkletNode(ctx, 'digital_noise_processor'),
    flowData: new AudioNodeFlowInterface({
      label: "Digital Noise",
      inputs: 0,
      params: [{
        name: "frequency",
        min: 0,
        max: 22000,
        sliderAction: "exp"
      }],
      outputs: 1
    })
  }
}

export default AudioNodeLibrary