import { Actor, Collider, CollisionContact, CollisionType, Side, Vector } from "excalibur";
import { Ball, BallType } from "./ball";


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

  removeCueBall() {
    this.holedBalls = this.holedBalls.filter(ball => ball.type !== BallType.Cue);
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
