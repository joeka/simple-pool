import { Collider, CollisionContact, Engine, Keys, Side, vec, Vector } from "excalibur";
import { Ball } from "./ball";


export class CueBall extends Ball {
  constructor(config: { pos?: Vector }) {
    super({ pos: config.pos });
  }

  override onInitialize() {
    super.onInitialize()
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Put any update logic here runs every frame before Actor builtins
    if (engine.input.keyboard.wasPressed(Keys.Left)) {
      this.body.vel = vec(-100, 0)
    }
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
