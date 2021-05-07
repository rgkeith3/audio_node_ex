export type Param = {
  name: string,
  min: number,
  max: number,
  sliderAction?: string
}
export type Constant = {
  name: string,
  options: string[]
}

export type AudioNodeFlowInterfaceOptions = {
  audioNode?: AudioNode
  label: string
  params?: Param[]
  constants?: Constant[],
  inputs?: number,
  outputs?: number
}

export class AudioNodeFlowInterface {
  constructor(options: AudioNodeFlowInterfaceOptions) {
    const { label, params, constants, inputs, outputs } = options;
    this.label = label;
    this.params = params || [];
    this.constants = constants || [];
    this.outputs = outputs || 0;
    this.inputs = inputs || 0;
  }
  label: string;
  params: Param[];
  constants: Constant[];
  outputs: number;
  inputs: number;
}

export type AudioNodeLibraryEntry = {
  func: (ctx: AudioContext) => AudioNode;
  flowData: AudioNodeFlowInterface;
}