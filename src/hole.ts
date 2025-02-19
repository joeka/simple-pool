import { Actor, Collider, CollisionContact, CollisionType, Engine, Side, vec, Vector } from "excalibur";
import { Ball } from "./ball";


export type HoleArgs = {
  pos: Vector,
  radius: number
}

export class Hole extends Actor {
  private holedBalls: Ball[] = [];
  private radius: number = 0;

  constructor({pos, radius}: HoleArgs) {
    super({
      name: "Hole",
      pos: pos,
      radius: radius,
      collisionType: CollisionType.Passive
    });
    this.radius = radius;
  }

  override onPreCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    if (!other.owner.hasTag("Ball"))
      return;

    if (this.holedBalls.includes(other.owner as Ball))
      return;

    const ball = other.owner as Ball;
    const distance = ball.pos.distance(this.globalPos);
    const isInside = distance <= this.radius;

    if (isInside) {
      this.holedBalls.push(ball);
      ball.holeIn(this);
    }
  }
}    
