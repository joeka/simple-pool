import { Component, Engine, PointerEvent } from 'excalibur'
import { Ball } from '../actors/ball';
import { Table } from '../actors/table';

export class BallInHandComponent extends Component {
  declare owner: Ball;

  private engine: Engine | undefined;

  private active: boolean;
  private table: Table | undefined;

  constructor() {
    super();
    this.active = false;
  }

  public setActive(active: boolean) {
    if (active !== this.active) {
      this.active = active;
      this.owner.setInHand(active);
    }
  }

  public isActive(): boolean {
    return this.active;
  }

  onAdd(owner: Ball): void {
    this.engine = owner.scene?.engine;
    if (!this.engine) return;

    this.table = this.engine.currentScene.world.queryTags(["Table"])
      .entities[0] as Table;

    this.engine.input.pointers.primary.on("down", this.onPointerDown);
    this.engine.input.pointers.primary.on("move", this.onPointerMove);
  }

  onRemove(): void {
    if (!this.engine) return;

    this.engine.input.pointers.primary.off("down", this.onPointerDown);
    this.engine.input.pointers.primary.off("move", this.onPointerMove);
  }

  private onPointerDown = (_event: PointerEvent): void => {
    if (!this.active)
      return;

    if (this.owner.collisions == 0) {
      this.setActive(false);
    }
  }

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.active)
      return;

    if (this.table?.collider.bounds.contains(event.coordinates.worldPos)) {
      this.owner.body.pos = event.coordinates.worldPos;
    }
  }
}