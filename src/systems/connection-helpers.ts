import Peer, { DataConnection } from "peerjs";

export const tryHostConnection = (peerID: string): Promise<DataConnection> => 
  new Promise((resolve, reject) => {
    const peer = new Peer();
    peer.on("open", (_id) => {
      const connection = peer.connect(peerID);
      connection.on("open", () => {
        resolve(connection);
      })
      connection.on("error", (err) => {
        reject(err);
      });
    });
    peer.on("error", (err) => {
      reject(err);
    });
  }
);