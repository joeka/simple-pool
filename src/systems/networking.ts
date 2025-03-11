import { System, Query, SystemType, World, TransformComponent, Scene } from "excalibur";
import { DataConnection, Peer } from "peerjs";
import { tryHostConnection } from "./connection-helpers";

export class NetworkingSystem extends System {
  transformQuery: Query<typeof TransformComponent>;
  systemType: SystemType

  private peerId: string;
  private peer: Peer | undefined;
  private connection: DataConnection | undefined;

  constructor(world: World) {
    super();
    this.transformQuery = world.query([TransformComponent]);
    this.systemType = SystemType.Update;
    this.peerId = window.location.pathname.substring(1);
  }

  generateNewPeerId(): void {
    this.peerId = Math.random().toString(36).substring(2, 15);
  }

  initialize(world: World, scene: Scene): void {
    if (!this.peerId) {
      this.generateNewPeerId();
      window.history.pushState({}, "", "/" + this.peerId);
      this.becomeHost();
      return;
    }

    tryHostConnection(this.peerId)
      .then((connection) => {
        this.connection = connection;
        console.log("Connected to host with ID:", this.peerId);
        this.setupConnectionHandlers();
      })
      .catch((err) => {
        if (err.type === "peer-unavailable") {
          console.log("Peer unavailable, becoming host");
          this.becomeHost();
        }
      }); 
  }
  
  becomeHost(): void {
    this.connection?.close();
    this.peer = new Peer(this.peerId);
    this.peer.on("open", (id) => {
      console.log("Hosting with ID:", id);
    });
    this.peer?.on("connection", (connection) => {
      this.connection = connection;
      console.log("Connected to client with ID:", this.peerId);
      this.setupConnectionHandlers();
    });
  }

  setupConnectionHandlers() {
    this.connection?.on("data", (data) => {
      console.log("Data received: " + data);
    });
    this.connection?.on("error", (err) => {
      console.log("Connection error", err);
    });
  }

  update(delta: number): void {
    for (let entity of this.transformQuery.entities) {
      const transform = entity.get(TransformComponent);
      if (transform.owner?.hasTag("Ball") || transform.owner?.hasTag("Cue")) {
        //do something
      }
    }
  }
}
