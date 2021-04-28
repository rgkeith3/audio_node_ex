import React, {useState} from 'react';
import { Handle, useStoreState, useStoreActions } from 'react-flow-renderer';
import connection from '../Connection';
import channel from '../socket';

const ReceiverFlowNode = ({ id, data: {audioNode} }) => {
  const [code, setCode] = useState("");
  const nodes = useStoreState(store => store.nodes);
  const setElements = useStoreActions(actions => actions.setElements);

  return (
    <div key={id}>
      <Handle type="source" position="right" />
      <div className="label">Receiver</div>
      <div className="code">Your Code is <strong>{window.sessionUuid}</strong></div>
      <div className="description">Enter their code and connect</div>
      <input value={code} onChange={ev => setCode(ev.target.value)} />
      <button type="button" disabled={code.length < 6}>Connect</button>
    </div>
  );
}

export default ReceiverFlowNode;