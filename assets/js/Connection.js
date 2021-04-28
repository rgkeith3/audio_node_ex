import { Socket } from "phoenix";

class Connection {
  constructor() {
    this.socket = new Socket("/socket", { params: { token: window.sessionUuid}});
    this.socket.connect();
    this.channel = this.socket.channel(`signal:${window.sessionUuid}`, {});
    this.channel.join()
      .receive("ok", resp => console.log("Joined Sucessfully", resp))
      .receive("error", resp => console.log("Unable to Join", resp));

    this.channel.on("offer", this.onOfferSignal.bind(this));
    this.channel.on("answer", this.onAnswerSignal.bind(this));
    this.channel.on("ice-candidate", this.onIceCandidateSignal.bind(this));
    this.rtcPeers = {}
  }

  getRTCPeer(uuid) {
    if (!this.rtcPeers[uuid]) {
      const rtcPeerConnection = new RTCPeerConnection({ 
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          }
        ]
      });
      rtcPeerConnection.onicecandidate = this.onIceCandidate.bind(this, uuid);
      rtcPeerConnection.onnegotiationneeded = this.offer.bind(this, uuid);
      rtcPeerConnection.ontrack = this.onTrack.bind(this);
      this.rtcPeers[uuid] = rtcPeerConnection
    }
    return this.rtcPeers[uuid];
  }

  newConnection(uuid, mediaTrack) {
    this.getRTCPeer(uuid).addTrack(mediaTrack);
  }

  offer(uuid) {
    console.log("Making Offer");
    
    this.getRTCPeer(uuid).createOffer()
      .then(offer => this.getRTCPeer(uuid).setLocalDescription(offer))
      .then(() => {
        this.channel.push("offer", {targetUuid: uuid, offer: this.rtcPeers[uuid].localDescription});
      });
  }

  onOfferSignal({ offer, from }) {
    console.log("Received Offer");
    
    const remoteDesc = new RTCSessionDescription(offer);
    this.getRTCPeer(from).setRemoteDescription(remoteDesc)
      .then(() => this.getRTCPeer(from).createAnswer())
      .then(answer => this.getRTCPeer(from).setLocalDescription(answer))
      .then(() => {
        console.log("Sending Answer");
        this.channel.push("answer", {targetUuid: from, answer: this.getRTCPeer(from).localDescription})
      });
  }

  onAnswerSignal({ answer, from }) {
    console.log("Received Answer");
    const remoteDesc = new RTCSessionDescription(answer);
    this.getRTCPeer(from).setRemoteDescription(remoteDesc);
  }

  onIceCandidate(uuid, { candidate }) {
    console.log("Handling ICE candidate");
    if (candidate) {
      console.log("Sending ICE candidate");
      this.channel.push("ice-candidate", {targetUuid: uuid, candidate});
    }
  }

  onTrack(ev) {
    console.log("Handling Track");
    console.log(ev);
    debugger;
  }

  onIceCandidateSignal({ from, candidate }) {
    console.log("Received ICE candidate");
    this.getRTCPeer(from).addIceCandidate(candidate);
  }
}

const conn = new Connection();
window.conn = conn;

export default conn;