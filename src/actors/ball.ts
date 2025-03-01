import { Actor, Collider, CollisionContact, CollisionType, Engine, Side, vec, Vector } from "excalibur";
import { Resources } from "../resources";
import { ShootingComponent } from "../components/shooting";
import { Hole } from "./hole";
import { BallInHandComponent } from "../components/ball-in-hand";

const VELOCITY_THRESHOLD = 1

export enum BallType {
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
  public static radius: number = 16;
  number?: number
  type: BallType
  friction_vel_loss: number;
  holed: boolean;
  collisions: number;

  constructor(config: BallArgs) {
    super({
      name: nameFromNumber(config.number),
      pos: config.pos,
    });
    this.number = config.number
    this.type = typeFromNumber(config.number);
    this.friction_vel_loss = 2;
    this.holed = false;

    this.collisions = 0;

    this.addTag("Ball");
    this.addTag(BallType[this.type]);
    this.collider.useCircleCollider(Ball.radius);
    this.body.collisionType = CollisionType.Active;
    this.body.bounciness = 0.8;
    this.body.mass = 1;
  }

  override onInitialize() {
    if (this.type == BallType.Cue) {
      this.graphics.add(Resources.CueBall.toSprite());
      this.addComponent(new ShootingComponent());
      this.addComponent(new BallInHandComponent());
    } else {
      let resourceKey = "Ball" + this.number as keyof typeof Resources
      this.graphics.add(Resources[resourceKey].toSprite());
    }
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    const speed = this.vel.magnitude;
    if (speed === 0)
      return;

    const velScale = (speed - this.friction_vel_loss) / speed;
    this.vel = this.vel.scale(velScale);
    this.angularVelocity = this.angularVelocity * velScale;

    // stop when ball is very slow
    if (this.vel.magnitude < VELOCITY_THRESHOLD) {
      this.vel = vec(0, 0);
      this.angularVelocity = 0;
    }
  }

  isStill(): boolean {
    return this.vel.magnitude < VELOCITY_THRESHOLD;
  }

  holeIn(hole: Hole) {
    this.holed = true;
    const holePos = hole.globalPos;
    const offset = holePos.sub(this.pos);
    const velocity = !!this.vel.magnitude ? this.vel.magnitude : 1;

    this.actions
      .moveBy(offset, velocity)
      .scaleTo(Vector.Zero, vec(15, 15))
      .callMethod(
        () => {
          if (this.type == BallType.Cue) {
            this.setInHand(true);
            hole.removeCueBall();
          } else {
            this.removeBall()
          }
        }
      );
  }

  setInHand(inHand: boolean) {
    if (this.type != BallType.Cue)
      return;

    if (inHand) {
      this.body.collisionType = CollisionType.Passive;
      this.angularVelocity = 0;
      this.actions.scaleTo(Vector.One, vec(4, 4));
    } else {
      this.holed = false;
      this.body.collisionType = CollisionType.Active;
    }
  }

  removeBall() {
    this.kill();
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
    this.collisions += 1;
  }

  override onCollisionEnd(self: Collider, other: Collider, side: Side, lastContact: CollisionContact): void {
    this.collisions -= 1;
  }
}
