import React, {useState} from 'react';
import { Handle, useStoreState, useStoreActions } from 'react-flow-renderer';
import AudioContextGlobal from '../AudioContextGlobal';
import { AudioNodeFlowInterface } from '../AudioNodeFlowInterface';
import connection from '../Connection';

const ReceiverFlowNode = ({ id, data: {label}, xPos, yPos}) => {
  const [code, setCode] = useState("");
  const {nodes, edges} = useStoreState(store => store);
  const setElements = useStoreActions(actions => actions.setElements);

  const onTrack = (track) => {
    const audioNode = new AudioNodeFlowInterface({ label, audioNode: AudioContextGlobal.createMediaStreamSource(new MediaStream([track]))});
    const flowNode = nodes.find(({id: nodeId}) => nodeId === id);
    const edgesToConnect = edges.filter(({source}) => source === id);
    flowNode.data.audioNode.disconnect();
    edgesToConnect.forEach(({target, targetHandle}) => {
      const targetAudioNode = nodes.find(({id: nodeId}) => nodeId === target);
      audioNode.connectNode(targetAudioNode.data, targetHandle);
    });
    const elements = nodes.filter(({id: nodeId}) => nodeId !== id).concat(edges).concat({id, data: audioNode, position: {x: xPos, y: yPos} })
    setElements(elements);
  }

  const onClick = () => {
    connection.onTrackCallback(code, onTrack.bind(this));
    connection.receiverReady(code)
  };
  return (
    <div key={id}>
      <Handle type="source" position="right" />
      <div className="label">Receiver</div>
      <div className="code">Your Code is <strong>{window.sessionUuid}</strong></div>
      <div className="description">Enter their code and connect</div>
      <input value={code} onChange={ev => setCode(ev.target.value)} />
      <button type="button" disabled={code.length < 6} onClick={onClick}>Connect</button>
    </div>
  );
}

export default ReceiverFlowNode;