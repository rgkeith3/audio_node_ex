import { Connection, Edge } from "react-flow-renderer";
import AudioNodeLibrary from "./AudioNodeLibrary";

export class AudioNodeGraph {
  constructor() {
    this.audioCtx = new AudioContext();
    this.nodes = new Map();
    this.state = this.audioCtx.state;
    this.loaded = false;

    // load processors
    const promises = [
      "white_noise_processor.js",
      "digital_noise_processor.js"
    ].map(processor => this.audioCtx.audioWorklet.addModule(`/audio_worklet_processors/${processor}`));
    Promise.all(promises).then(() => {this.loaded = true;})
    
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.add = this.add.bind(this);
    this.set = this.set.bind(this);
    this.get = this.get.bind(this);
    this.remove = this.remove.bind(this);
    this.resume = this.resume.bind(this);
    this.suspend = this.suspend.bind(this);
  }

  connect(connection: Connection | Edge) : void {
    const { source, target, targetHandle } = connection;
    const sourceNode = this.nodes.get(source!);
    const targetNode = this.nodes.get(target!);
    if (sourceNode && targetNode) {
      sourceNode.connect(this.getTarget(targetNode, targetHandle));
    }
  }

  disconnect(edge: Edge) : void {
    const { source, target, targetHandle } = edge;
    const sourceNode = this.nodes.get(source);
    const targetNode = this.nodes.get(target);
    if (sourceNode && targetNode) {
      sourceNode.disconnect(this.getTarget(targetNode, targetHandle));
    }
  }

  getTarget(targetNode: any, targetHandle: string | null | undefined) {
    if (!targetHandle) return targetNode;

    if (targetNode instanceof AudioWorkletNode) {
      // @ts-ignore: AudioParamMap interface definition missing functions
      return targetNode.parameters.get(targetHandle);
    }
    return targetNode[targetHandle];
  }

  // redefine audioNodeFlowInterface and return here
  add(type: string, id: string) : any {
    const { audioNode, ...rest} = AudioNodeLibrary[type](this.audioCtx);
    this.nodes.set(id, audioNode);
    return rest;
  }

  set(id: string, node: AudioNode) {
    this.nodes.set(id, node);
  }

  get(id: string) : AudioNode | undefined {
    return this.nodes.get(id);
  }

  remove(id: string) : boolean {
    this.nodes.get(id).disconnect();
    return this.nodes.delete(id);
  }

  resume() : Promise<"closed" | "running" | "suspended">{
    return this.audioCtx.resume().then(() => this.state = this.audioCtx.state);
  }

  suspend() : Promise<"closed" | "running" | "suspended"> {
    return this.audioCtx.suspend().then(() => this.state = this.audioCtx.state);
  }

  loaded: boolean;
  state: string;
  audioCtx: AudioContext;
  nodes: Map<string, any>;
}

export default new AudioNodeGraph();