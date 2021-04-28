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
  constants?: Constant[]
}

export class AudioNodeFlowInterface {
  constructor(options: AudioNodeFlowInterfaceOptions) {
    const { audioNode, label, params, constants } = options;
    this.audioNode = audioNode;
    this.label = label;
    this.params = params || [];
    this.constants = constants || [];
    this.outputs = audioNode && audioNode.numberOfOutputs || 0;
    this.inputs = audioNode && audioNode.numberOfInputs || 0;
  }
  connectNode (targetNode: AudioNodeFlowInterface, targetHandle: string | null) {
    this.audioNode.connect(targetHandle ? targetNode.audioNode[targetHandle] : targetNode.audioNode)
  };
  disconnectNode (targetNode: AudioNodeFlowInterface, targetHandle: string | null) {
    this.audioNode.disconnect(targetHandle ? targetNode.audioNode[targetHandle] : targetNode.audioNode)
  };
  label: string;
  audioNode: any;
  params: Param[];
  constants: Constant[];
  outputs: number;
  inputs: number;
}
