import { Component, PointerEvent, Vector } from 'excalibur'
import { Cue } from '../cue';
import { Ball } from '../ball';

export class ShootingComponent extends Component {
  declare owner: Ball;

  private cue: Cue;
  private isDragged: boolean;
  private dragStart: Vector;
  private dragEnd: Vector;
  private ballRadius: number = 18;

  constructor() {
    super();
    this.cue = new Cue();
    this.dragStart = Vector.Zero;
    this.dragEnd = Vector.Zero;
    this.isDragged = false;
  }

  onAdd(owner: Ball): void {
    this.ballRadius = owner.radius;
    const engine = owner.scene?.engine;
    if (engine) {
      engine.input.pointers.primary.on("down", this.onDragStart.bind(this));
      engine.input.pointers.primary.on("move", this.onPointerMove.bind(this));
      engine.input.pointers.primary.on("up", this.onDragEnd.bind(this));
      engine.currentScene.add(this.cue);
    } 
  }

  onDragStart(event: PointerEvent) {
    this.isDragged = true;
    this.dragStart = event.coordinates.worldPos;
  }

  onPointerMove(event: PointerEvent) {
    if (!this.isDragged && !this.owner.isStill())
      return;
    const dragPos = event.coordinates.worldPos;
    const ballPosition = this.owner.pos;
    const cueDistToBall = this.isDragged ? this.dragStart.sub(dragPos).magnitude : 0
    const dragDirection = ballPosition.sub(dragPos).normalize();
    this.cue.pos = this.owner.pos.sub(dragDirection.scale(this.ballRadius + cueDistToBall))
    this.cue.rotation = dragDirection.toAngle();
  }

  onDragEnd(event: PointerEvent) {
    if (!this.isDragged)
      return;
    this.dragEnd = event.coordinates.worldPos;
    const dragDirection = this.owner.pos.sub(this.dragEnd).normalize();
    this.isDragged = false;
    this.cue.actions.moveTo({
      pos: this.owner.pos.sub(dragDirection.scale(this.ballRadius)),
      duration: 20
    }).callMethod(() => this.applyVelocity());
  }

  applyVelocity() {
    const direction = this.dragStart.sub(this.dragEnd);
    const velocity = direction.scale(10);
    this.owner.vel = velocity;
  }
}