import { Actor, Collider, CollisionContact, Engine, Side, vec } from "excalibur";
import { Resources } from "../resources";


export class Cue extends Actor {
  constructor() {
    super({
      name: "Cue",
      anchor: vec(1, 0.5)
    });
    this.addTag("Cue");
  }

  override onInitialize() {
    this.graphics.add(Resources.Cue.toSprite());
  }

  setVisibility(visible: boolean) {
    this.graphics.isVisible = visible;
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Put any update logic here runs every frame before Actor builtins-
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    // Put any update logic here runs every frame after Actor builtins
  }

  override onPreCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Called before a collision is resolved, if you want to opt out of this specific collision call contact.cancel()
  }

  override onPostCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Called every time a collision is resolved and overlap is solved
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Called when a pair of objects are in contact
  }

  override onCollisionEnd(self: Collider, other: Collider, side: Side, lastContact: CollisionContact): void {
    // Called when a pair of objects separates
  }
}
