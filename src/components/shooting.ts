import { Component, PointerEvent, Vector } from 'excalibur'
import { Cue } from '../cue';
import { Ball } from '../ball';

export class ShootingComponent extends Component {
  declare owner: Ball;

  private cue: Cue;
  private isDragged: boolean;
  private dragStart: Vector;
  private dragEnd: Vector;
  private ballRadius: number = Ball.radius;

  constructor() {
    super();
    this.cue = new Cue();
    this.dragStart = Vector.Zero;
    this.dragEnd = Vector.Zero;
    this.isDragged = false;
  }

  onAdd(owner: Ball): void {
    const engine = owner.scene?.engine;
    if (!engine) return;

    engine.input.pointers.primary.on("down", this.onDragStart);
    engine.input.pointers.primary.on("move", this.onPointerMove);
    engine.input.pointers.primary.on("up", this.onDragEnd);
    engine.currentScene.add(this.cue);
  }

  onRemove(): void {
    const engine = this.owner.scene?.engine;
    if (!engine) return;

    engine.input.pointers.primary.off("down", this.onDragStart);
    engine.input.pointers.primary.off("move", this.onPointerMove);
    engine.input.pointers.primary.off("up", this.onDragEnd);
  }

  private onDragStart = (event: PointerEvent): void => {
    this.isDragged = true;
    this.dragStart = event.coordinates.worldPos;
  }

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.isDragged && !this.owner.isStill())
      return;
    const dragPos = event.coordinates.worldPos;
    const ballPosition = this.owner.pos;
    const cueDistToBall = this.isDragged ? this.dragStart.sub(dragPos).magnitude : 0
    const dragDirection = ballPosition.sub(dragPos).normalize();
    this.cue.pos = this.owner.pos.sub(dragDirection.scale(this.ballRadius + cueDistToBall))
    this.cue.rotation = dragDirection.toAngle();
  }

  private onDragEnd = (event: PointerEvent): void => {
    if (!this.isDragged)
      return;
    this.dragEnd = event.coordinates.worldPos;
    const dragDirection = this.owner.pos.sub(this.dragEnd).normalize();
    this.isDragged = false;
    this.cue.actions.moveTo({
      pos: this.owner.pos.sub(dragDirection.scale(this.ballRadius)),
      duration: 20 // duration of the shot, from letting cue go to hitting the ball
    }).callMethod(this.applyVelocity);
  }

  private applyVelocity = (): void => {
    const direction = this.owner.pos.sub(this.dragEnd).normalize();
    const strength = this.dragStart.sub(this.dragEnd).magnitude
    const velocity = direction.scale(strength * 10); // arbitrary multiplier for shooting strength
    this.owner.vel = velocity;
  }
}