import React, {useState} from 'react';
import { Handle } from 'react-flow-renderer';
import connection from '../Connection';

const SenderFlowNode = ({id, data: {audioNode} }) => {
  const [code, setCode] = useState("");

  // const onClick = () => connection.newConnection(code, audioNode.stream.getTracks()[0])
  const onClick = () => {
    connection.onKickoffCallback(code, () => {
      connection.newConnection(code, audioNode.stream.getTracks()[0]);
    });
    connection.senderReady(code)
  };
  return (
    <div key={id}>
      <Handle type="target" position="left" />
      <div className="label">Sender</div>
      <div className="code">Your Code is <strong>{window.sessionUuid}</strong></div>
      <div className="description">Enter their code and connect</div>
      <input value={code} onChange={ev => setCode(ev.target.value)} />
      <button type="button" disabled={code.length < 6} onClick={onClick}>Connect</button>
    </div>
  );
}

export default SenderFlowNode;