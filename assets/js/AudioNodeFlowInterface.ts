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
    const { audioNode, label, params, constants, inputs, outputs } = options;
    this.audioNode = audioNode;
    this.label = label;
    this.params = params || [];
    this.constants = constants || [];
    this.outputs = outputs ?? (audioNode && audioNode.numberOfOutputs || 0);
    this.inputs = inputs ?? (audioNode && audioNode.numberOfInputs || 0);
  }
  label: string;
  audioNode: any;
  params: Param[];
  constants: Constant[];
  outputs: number;
  inputs: number;
}
