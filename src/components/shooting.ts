import { Actor, Component, PointerEvent, Vector } from 'excalibur'

export class ShootingComponent extends Component {
  declare owner: Actor;

  private isDragged: boolean;
  private dragStart: Vector;
  private dragEnd: Vector;

  constructor() {
    super();
    this.dragStart = Vector.Zero;
    this.dragEnd = Vector.Zero;
    this.isDragged = false;
  }

  onAdd(owner: ex.Actor): void {
    owner.on('pointerdown', this.onDragStart.bind(this));
    const engine = owner.scene?.engine;
    if (engine) {
      engine.input.pointers.primary.on('up', this.onDragEnd.bind(this));
    } 
  }

  onDragStart(event: PointerEvent) {
    this.dragStart = event.coordinates.worldPos;
    this.isDragged = true;
  }

  onDragEnd(event: PointerEvent) {
    if (!this.isDragged)
      return;
    this.dragEnd = event.coordinates.worldPos;
    this.isDragged = false;
    this.applyVelocity();
  }

  applyVelocity() {
    const direction = this.dragStart.sub(this.dragEnd);
    const velocity = direction.scale(10);
    this.owner.vel = velocity;
  }
}