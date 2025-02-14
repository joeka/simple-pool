import { Actor, Component, Vector, PointerEvent, Keys, KeyEvent } from "excalibur";

// very simple helper component for drawing collider shapes
// add component to actor, then click on the collider points in-game and hit enter
// shape is printed to console
export class ColliderPaintingComponent extends Component {
  origin: Vector = Vector.Zero;
  points: Vector[] = [];

  onAdd(owner: Actor): void {
    this.origin = owner.pos;
    const engine = owner.scene?.engine;
    if (!engine) return;
    engine.input.pointers.primary.on("down", this.onClick);
    engine.input.keyboard.on("press", this.onEnter);
  }

  private onClick = (event: PointerEvent) => {
    const point = event.coordinates.worldPos;
    const localPoint = point.sub(this.origin);
    this.points.push(localPoint);
  }

  private onEnter = (event: KeyEvent) => {
    if (event.key !== Keys.Enter)
      return;

    const vectors = this.points.map(p => `vec(${Math.round(p.x)}, ${Math.round(p.y)})`) 
    const output = `Shape.Polygon([${vectors.join(", ")}])`
    console.log(output);
    this.points = []
  }
}