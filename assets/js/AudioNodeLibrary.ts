import { AudioNodeFlowInterface, AudioNodeLibraryEntry, ControlParam } from "./AudioNodeFlowInterface";
import ControlNode from "./ControlNode";

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
      outputs: "audio"
    }),
    flowNodeType: "generic"
  },
  output: {
    func: (ctx) => ctx.destination,
    flowData: new AudioNodeFlowInterface({
      label: "Output",
      inputs: "audio"
    }),
    flowNodeType: "generic"
  },
  gain: {
    func: (ctx) => ctx.createGain(),
    
    flowData: new AudioNodeFlowInterface({
      label: "Gain",
      params: [{ name: "gain", min: 0, max: 22000, sliderAction: "exp"}],
      inputs: "audio",
      outputs: "audio"
    }),
    flowNodeType: "generic"
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
      outputs: "audio"
    }),
    flowNodeType: "generic"
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
      inputs: "audio",
      outputs: "audio"
    }),
    flowNodeType: "generic"
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
      inputs: "audio",
      outputs: "audio"
    }),
    flowNodeType: "generic"
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
      inputs: "audio",
      outputs: "audio"
    }),
    flowNodeType: "generic"
  },
  sender: {
    func: (ctx) => ctx.createMediaStreamDestination(),
    flowData: new AudioNodeFlowInterface({
      label: "Sender",
      inputs: "audio",
    }),
    flowNodeType: "sender"
  },
  receiver: {
    // this is a placeholder audioNode that will output silence,
    // the audioNode will be replaced when the connection happens
    func: (ctx) => ctx.createBufferSource(),
    flowData: new AudioNodeFlowInterface({
      label: "Receiver",
      outputs: "audio",
    }),
    flowNodeType: "reciever"
  },
  noise: {
    func: (ctx) => new AudioWorkletNode(ctx, 'white_noise_processor'),
    flowData: new AudioNodeFlowInterface({
      label: "Noise",
      outputs: "audio"
    }),
    flowNodeType: "generic"
  },
  digitalNoise: {
    func: (ctx) => new AudioWorkletNode(ctx, 'digital_noise_processor'),
    flowData: new AudioNodeFlowInterface({
      label: "Digital Noise",
      params: [{
        name: "frequency",
        min: 0,
        max: 22000,
        sliderAction: "exp"
      }],
      outputs: "audio"
    }),
    flowNodeType: "generic"
  },
  ad: {
    func: () => new ControlNode({
      attack: new ControlParam(0.1),
      decay: new ControlParam(0.2),
      stages: ["attack", "decay"]
    }),
    flowData: new AudioNodeFlowInterface({
      label: "AD envelope",
      inputs: "trigger",
      outputs: "control",
      params: [
        {
          name: "attack",
          min: 0,
          max: 60,
          sliderAction: "exp"
        },
        {
          name: "decay",
          min: 0,
          max: 60,
          sliderAction: "exp"
        }
      ]
    }),
    flowNodeType: "control"
  }
  // adsr: {
  //   func: () => new ControlNode({
  //     attack: new ControlParam(0.1),
  //     decay: new ControlParam(0.2),
  //     sustain: new ControlParam(0.8),
  //     release: new ControlParam(0.5)
  //   }),
  //   flowData: new AudioNodeFlowInterface({
  //     label: "ADSR envelope",
  //     inputs: "trigger",
  //     outputs: "control",
  //     params: [
  //       {
  //         name: "attack",
  //         min: 0,
  //         max: 60,
  //         sliderAction: "exp"
  //       },
  //       {
  //         name: "decay",
  //         min: 0,
  //         max: 60,
  //         sliderAction: "exp"
  //       },
  //       {
  //         name: "sustain",
  //         min: 0,
  //         max: 1,
  //         sliderAction: "lin"
  //       },
  //       {
  //         name: "release",
  //         min: 0,
  //         max: 60,
  //         sliderAction: "release"
  //       }
  //     ]
  //   }),
    // flowNodeType: "control"
  // }
}

export default AudioNodeLibrary