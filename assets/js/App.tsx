import React, { useState } from 'react';
import ReactFlow, { addEdge, updateEdge, ReactFlowProvider, removeElements, Controls, isEdge, Connection, OnLoadParams, Elements, Edge, Background, ConnectionLineType, isNode } from 'react-flow-renderer'
import '../css/App.css'
import Pallette from './Pallette';
import AudioFlowNode from './components/flow_nodes/AudioFlowNode';
import SenderFlowNode from './components/flow_nodes/SenderFlowNode';
import ReceiverFlowNode from './components/flow_nodes/ReceiverFlowNode';
import AudioNodeGraph from './AudioNodeGraph';
import AudioNodeLibrary from './AudioNodeLibrary';

const nodeTypes = {
  default: AudioFlowNode,
  sender: SenderFlowNode,
  receiver: ReceiverFlowNode
};

let id = 0;
const getId = () => `${id++}`;

const App = () => {
  const [audioCtxState, setAudioCtxState] = useState(AudioNodeGraph.state);
  const [patchInstance, setPatchInstance] = useState<OnLoadParams>();
  const [elements, setElements] = useState<Elements>([]);

  const toggleAudioCtxState = () => {
    if (audioCtxState === "running") {
      AudioNodeGraph.suspend().then(state => setAudioCtxState(state));
    } else {
      AudioNodeGraph.resume().then(state => setAudioCtxState(state));
    }
  }

  const onLoad = (reactFlowInstance: OnLoadParams) => setPatchInstance(reactFlowInstance);

  const onConnect = (connection: Connection | Edge) => {
    setElements((els) => addEdge({...connection, type: ConnectionLineType.SmoothStep}, els));
    AudioNodeGraph.connect(connection);
  }

  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
    setElements((els) => updateEdge(oldEdge, newConnection, els));

    AudioNodeGraph.disconnect(oldEdge);
    AudioNodeGraph.connect(newConnection);
  }

  const onElementsRemove = (elementsToRemove: Elements) => {
    setElements((els) => removeElements(elementsToRemove, els));
    elementsToRemove.forEach((element) => {
      if (isEdge(element)) {
        AudioNodeGraph.disconnect(element);
      }
    });

    elementsToRemove.forEach((element) => {
      if (isNode(element)) {
        AudioNodeGraph.remove(element.id);
      }
    })
  }

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer!.getData('application/reactflow');
    const position = patchInstance!.project({ x: event.clientX, y: event.clientY });

    const id = getId();
    AudioNodeGraph.add(type, id);

    const newNode = {
      id,
      type,
      position,
      data: AudioNodeLibrary[type].flowData
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