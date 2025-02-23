import { Component, PointerEvent, Vector } from 'excalibur'
import { Cue } from '../actors/cue';
import { Ball } from '../actors/ball';

export class ShootingComponent extends Component {
  declare owner: Ball;

  private cue: Cue;
  private isCharging: boolean;
  private cueDirection: Vector;
  private clickPosition: Vector;
  private chargingStrength: number;
  private ballRadius: number = Ball.radius;

  constructor() {
    super();
    this.cue = new Cue();
    this.isCharging = false;
    this.cueDirection = Vector.Zero;
    this.clickPosition = Vector.Zero;
    this.chargingStrength = 0;
  }

  onAdd(owner: Ball): void {
    const engine = owner.scene?.engine;
    if (!engine) return;

    engine.input.pointers.primary.on("down", this.onPointerDown);
    engine.input.pointers.primary.on("move", this.onPointerMove);
    engine.currentScene.add(this.cue);
  }

  onRemove(): void {
    const engine = this.owner.scene?.engine;
    if (!engine) return;

    engine.input.pointers.primary.off("down", this.onPointerDown);
    engine.input.pointers.primary.off("move", this.onPointerMove);
  }

  private onPointerDown = (event: PointerEvent): void => {
    if (!this.owner.isStill())
      return;

    if (this.isCharging) {
      this.isCharging = false;
      this.shoot();
      return;
    }
    this.isCharging = true;
    this.clickPosition = event.coordinates.worldPos;
  }

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.owner.isStill())
      return;
    
    if (this.isCharging) {
      this.chargeShot(event.coordinates.worldPos);
      return;
    }
    this.positionCue(event.coordinates.worldPos);
  }

  private positionCue = (pointerPosition: Vector) => {
    const ballPosition = this.owner.pos;
    this.cueDirection = ballPosition.sub(pointerPosition).normalize();
    this.cue.pos = ballPosition.sub(this.cueDirection.scale(this.ballRadius))
    this.cue.rotation = this.cueDirection.toAngle();
  }
  
  private chargeShot = (pointerPosition: Vector) => {
    const ballPosition = this.owner.pos;
    this.chargingStrength = this.clickPosition.sub(pointerPosition).magnitude;
    this.cue.pos = ballPosition.sub(this.cueDirection.scale(this.ballRadius + this.chargingStrength));
  }

  private shoot() {
    this.cue.actions.moveTo({
      pos: this.owner.pos.sub(this.cueDirection.scale(this.ballRadius)),
      duration: 30 // duration of the shot, from starting shot to hitting the ball
    }).callMethod(this.applyVelocity);
  }

  private applyVelocity = (): void => {
    const velocity = this.cueDirection.scale(this.chargingStrength * 10); // arbitrary multiplier for shooting strength
    this.owner.vel = velocity;
  }
}