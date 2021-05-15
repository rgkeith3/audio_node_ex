import { Connection, Edge } from "react-flow-renderer";
import { ControlParam, Param } from "./AudioNodeFlowInterface";
import AudioNodeLibrary from "./AudioNodeLibrary";
import ControlNode from "./ControlNode";
import { reverseTransformValue } from "./utils/tranformValues";

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
    this.getTarget = this.getTarget.bind(this);
    this.isValidConnection = this.isValidConnection.bind(this);
    this.remove = this.remove.bind(this);
    this.resume = this.resume.bind(this);
    this.suspend = this.suspend.bind(this);
  }

  connect(connection: Connection | Edge) : void {
    const { source, target, targetHandle } = connection;
    const sourceNode = this.nodes.get(source!)!;
    sourceNode.connect(this.getTarget(target!, targetHandle));
  }

  disconnect(edge: Edge) : void {
    const { source, target, targetHandle } = edge;
    const sourceNode = this.nodes.get(source)!;
    sourceNode.disconnect(this.getTarget(target, targetHandle));
  }

  // redefine audioNodeFlowInterface and return here
  add(type: string, id: string) : void {
    const audioNode = AudioNodeLibrary[type].func(this.audioCtx);
    this.nodes.set(id, audioNode);
  }

  set(id: string, node: AudioNode) {
    this.nodes.set(id, node);
  }

  get(id: string) : AudioNode | ControlNode | undefined {
    return this.nodes.get(id);
  }

  getTarget(id: string, param: string | null | undefined) : AudioNode | ControlNode | AudioParam | ControlParam {
    const targetNode = this.get(id)!;
    if (!param) return targetNode;

    if (targetNode instanceof AudioWorkletNode) {
      // @ts-ignore: AudioParamMap interface definition missing functions
      return targetNode.parameters.get(param);
    }
    // @ts-ignore: can't string index into AudioNode
    return targetNode[param];
  }

  isValidConnection(conn: Connection) {
    const source = this.get(conn.source!);
    const target = this.getTarget(conn.target!, conn.targetHandle);

    if ((source instanceof AudioNode || source instanceof ControlNode) && (target instanceof AudioNode || target instanceof AudioParam)) {
      return true;
    }
    return false;
  }

  getNodesInitialState(id: string, params: Param[]) : object {
    const audioNode = this.get(id);
    if (audioNode) {
      return params.reduce((initial, {name, sliderAction}) => {
        const nodeParam = this.getTarget(id, name);
        if (nodeParam instanceof AudioParam || nodeParam instanceof ControlParam) {
          //@ts-ignore
          initial[name] = nodeParam.value;
          //@ts-ignore
          initial[`${name}-slider`] = reverseTransformValue(sliderAction, nodeParam.value);
        }
        return initial;
      }, {});
    }
    return {};
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