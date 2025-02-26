import { Component, Engine, PointerEvent } from 'excalibur'
import { Ball } from '../actors/ball';

export class BallInHandComponent extends Component {
  declare owner: Ball;

  private engine: Engine | undefined;

  private isActive: boolean;

  constructor() {
    super();
    this.isActive = false;
  }

  public setActive(active: boolean) {
    if (active !== this.isActive) {
      this.isActive = active;
      this.owner.setInHand(active);
    }
  }

  onAdd(owner: Ball): void {
    this.engine = owner.scene?.engine;
    if (!this.engine) return;

    this.engine.input.pointers.primary.on("down", this.onPointerDown);
    this.engine.input.pointers.primary.on("move", this.onPointerMove);
  }

  onRemove(): void {
    if (!this.engine) return;

    this.engine.input.pointers.primary.off("down", this.onPointerDown);
    this.engine.input.pointers.primary.off("move", this.onPointerMove);
  }

  private onPointerDown = (event: PointerEvent): void => {
    if (!this.isActive)
      return;

    if (this.owner.collisions == 0) {
      this.setActive(false);
    }
  }

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.isActive)
      return;

    this.owner.body.pos = event.coordinates.worldPos;
  }
}