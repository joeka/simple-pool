import { Component, Engine, PointerEvent, Vector } from 'excalibur'
import { Cue } from '../actors/cue';
import { Ball } from '../actors/ball';

export class ShootingComponent extends Component {
  declare owner: Ball;

  private engine: Engine | undefined;

  private cue: Cue;
  private active: boolean;
  private charging: boolean;
  private cueDirection: Vector;
  private clickPosition: Vector;
  private chargingStrength: number;
  private ballRadius: number = Ball.radius;

  constructor() {
    super();
    this.cue = new Cue();
    this.active = false;
    this.charging = false;
    this.cueDirection = Vector.Zero;
    this.clickPosition = Vector.Zero;
    this.chargingStrength = 0;
  }

  public setActive(active: boolean) {
    if (active !== this.active) {
      // fade cue in/out when active state changes
      this.cue.actions.fade(Number(active), 200);
      this.active = active;
    }
  }

  public isActive(): boolean {
    return this.active;
  }

  onAdd(owner: Ball): void {
    this.engine = owner.scene?.engine;
    if (!this.engine) return;

    this.engine.input.pointers.primary.on("down", this.onPointerDown);
    this.engine.input.pointers.primary.on("move", this.onPointerMove);
    this.engine.currentScene.add(this.cue);
  }

  onRemove(): void {
    this.cue.kill();
    if (!this.engine) return;

    this.engine.input.pointers.primary.off("down", this.onPointerDown);
    this.engine.input.pointers.primary.off("move", this.onPointerMove);
  }

  private onPointerDown = (event: PointerEvent): void => {
    if (!this.active)
      return;

    if (this.charging) {
      this.charging = false;
      this.shoot();
      return;
    }
    this.charging = true;
    this.clickPosition = event.coordinates.worldPos;
  }

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.active)
      return;

    if (this.charging) {
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
    this.setActive(false);
  }
}