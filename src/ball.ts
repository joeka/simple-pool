import { Actor, Collider, CollisionContact, CollisionType, Engine, Shape, Side, vec, Vector } from "excalibur";
import { Resources } from "./resources";

// Actors are the main unit of composition you'll likely use, anything that you want to draw and move around the screen
// is likely built with an actor

// They contain a bunch of useful components that you might use
// actor.transform
// actor.motion
// actor.graphics
// actor.body
// actor.collider
// actor.actions
// actor.pointer

enum BallType {
  Cue,
  Low,
  High,
  Eight
}

function typeFromNumber(number?: number): BallType {
  if (number === undefined) {
    return BallType.Cue
  } else if (number >= 1 && number <= 7) {
    return BallType.Low
  } else if (number >= 9 && number <= 15) {
    return BallType.High
  } else if (number == 8) {
    return BallType.Eight
  } else {
    return BallType.Cue
  }
}

function nameFromNumber(number?: number): string {
  if (number === undefined) {
    return "CueBall"
  } else if (number >= 1 && number <= 15) {
    return "Ball" + number
  } else {
    return "CueBall"
  }
}

export type BallArgs = {
  number?: number,
  pos?: Vector
}

export class Ball extends Actor {
  number?: number
  type: BallType


  constructor(config: BallArgs) {
    super({
      name: nameFromNumber(config.number),
      width: 71,
      height: 71,
      pos: config.pos,
    });
    this.number = config.number
    this.type = typeFromNumber(config.number)
    this.body.collisionType = CollisionType.Active
    this.body.bounciness = 0.8
    this.body.mass = 1
    this.collider.set(Shape.Circle(18))
  }

  override onInitialize() {
    // Generally recommended to stick logic in the "On initialize"
    // This runs before the first update
    // Useful when
    // 1. You need things to be loaded like Images for graphics
    // 2. You need excalibur to be initialized & started 
    // 3. Deferring logic to run time instead of constructor time
    // 4. Lazy instantiation
    if (this.type == BallType.Cue) {
      this.graphics.add(Resources.CueBall.toSprite());
    } else {
      let resourceKey = "Ball" + this.number as keyof typeof Resources
      this.graphics.add(Resources[resourceKey].toSprite());
    }
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Put any update logic here runs every frame before Actor builtins
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
