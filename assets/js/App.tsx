import React, { useState } from 'react';
import ReactFlow, { addEdge, updateEdge, ReactFlowProvider, removeElements, Controls, isEdge, Connection, OnLoadParams, Elements, Edge, Background, ConnectionLineType } from 'react-flow-renderer'
import '../css/App.css'
import Pallette from './Pallette';
import AudioNodeLibrary from './AudioNodeLibrary';
import AudioFlowNode from './flow_nodes/AudioFlowNode';

const nodeTypes = {
  custom: AudioFlowNode
};

const audioCtx = new AudioContext();

let id = 0;
const getId = () => `${id++}`;

const App = () => {
  const [audioCtxState, setAudioCtxState] = useState(audioCtx.state);
  const [patchInstance, setPatchInstance] = useState<OnLoadParams>();
  const [elements, setElements] = useState<Elements>([]);

  const toggleAudioCtxState = () => {
    if (audioCtxState === "running") {
      audioCtx.suspend().then(() => setAudioCtxState(audioCtx.state));
    } else {
      audioCtx.resume().then(() => setAudioCtxState(audioCtx.state));
    }
  }

  const connectAudio = (conn: Connection | Edge) => {
    const { source, target, targetHandle } = conn;

    const sourceNode = elements.find(el => el.id === source);
    const targetNode = elements.find(el => el.id === target);
    if (sourceNode && targetNode) {
      sourceNode.data.connectNode(targetNode.data, targetHandle);
    }
  }

  const disconnectAudio = (edge: Edge) => {
    const { source, target, targetHandle } = edge;
    const sourceNode = elements.find(el => el.id === source);
    const targetNode = elements.find(el => el.id === target);
    if (sourceNode && targetNode) {
      sourceNode.data.disconnectNode(targetNode.data, targetHandle);
    }
  }

  const onLoad = (reactFlowInstance: OnLoadParams) => setPatchInstance(reactFlowInstance);

  const onConnect = (connection: Connection | Edge) => {
    connectAudio(connection);
    setElements((els) => addEdge({...connection, type: ConnectionLineType.SmoothStep}, els));
  }

  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
    disconnectAudio(oldEdge);
    connectAudio(newConnection);
    setElements((els) => updateEdge(oldEdge, newConnection, els));
  }

  const onElementsRemove = (elementsToRemove: Elements) => {
    elementsToRemove.forEach((element) => {
      if (isEdge(element)) {
        disconnectAudio(element);
      }
    });

    setElements((els) => removeElements(elementsToRemove, els));
  }

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer!.getData('application/reactflow');
    const position = patchInstance!.project({ x: event.clientX, y: event.clientY });
    const newNode = {
      id: getId(),
      type: "custom",
      position,
      data: AudioNodeLibrary[type](audioCtx),
    };

    setElements((es) => es.concat(newNode));
  };

  return (
      <div className="App" >
        <ReactFlowProvider>
            <div className="reactflow-wrapper">
              <ReactFlow 
                nodeTypes={nodeTypes} 
                elements={elements} 
                onConnect={onConnect}
                onElementsRemove={onElementsRemove}
                onEdgeUpdate={onEdgeUpdate}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onLoad={onLoad}
                snapToGrid={true}
                snapGrid={[15, 15]}
                connectionLineType={ConnectionLineType.SmoothStep}
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
            <button onClick={toggleAudioCtxState}>{audioCtxState === "running" ? "Stop" : "Start"}</button>
            <Pallette />
        </ReactFlowProvider>
      </div>
  );
}

export default App;