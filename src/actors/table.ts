import { Actor, Collider, CollisionContact, CollisionType, Engine, GraphicsGroup, Shape, Side, vec, Vector } from "excalibur";
import { Resources } from "../resources";
import { ColliderPaintingComponent } from "../utils/colliders-painting";
import { Hole } from "./hole";

// Actors are the main unit of composition you'll likely use, anything that you want to draw and move around the screen
// is likely built with an actor

// They contain a bunch of useful components that you might use
// actor.transform
// actor.motion
// actor.graphics
// actor.body
// actor.collider
// actor.actions
// actor.pointer

const build_table_collider = (width: number, height: number): Collider[] => {
  const halfWidth = width / 2
  const halfHeight = height / 2
  return [
    Shape.Edge(vec(-halfWidth, -halfHeight), vec(-halfWidth, halfHeight)),
    Shape.Edge(vec(-halfWidth, halfHeight), vec(halfWidth, halfHeight)),
    Shape.Edge(vec(halfWidth, halfHeight), vec(halfWidth, -halfHeight)),
    Shape.Edge(vec(halfWidth, -halfHeight), vec(-halfWidth, -halfHeight))
  ]
}

const build_cushion_collider = (): Collider[] => {
  return [
    Shape.Polygon([vec(-494, -209), vec(-495, 210), vec(-516, 231), vec(-569, 233), vec(-569, -229), vec(-516, -229)]),
    Shape.Polygon([vec(-484, -267), vec(-465, -249), vec(-44, -248), vec(-34, -267), vec(-33, -321), vec(-487, -320)]),
    Shape.Polygon([vec(21, -268), vec(30, -248), vec(457, -248), vec(478, -269), vec(478, -320), vec(23, -321)]),
    Shape.Polygon([vec(519, -230), vec(497, -210), vec(497, 209), vec(518, 232), vec(568, 231), vec(568, -229)]),
    Shape.Polygon([vec(456, 249), vec(478, 268), vec(478, 321), vec(23, 321), vec(22, 268), vec(30, 249)]),
    Shape.Polygon([vec(-42, 249), vec(-34, 267), vec(-34, 322), vec(-487, 319), vec(-483, 269), vec(-464, 249)]),
  ]
}

export class Table extends Actor {
  constructor() {
    super({
      // Giving your actor a name is optional, but helps in debugging using the dev tools or debug mode
      // https://github.com/excaliburjs/excalibur-extension/
      // Chrome: https://chromewebstore.google.com/detail/excalibur-dev-tools/dinddaeielhddflijbbcmpefamfffekc
      // Firefox: https://addons.mozilla.org/en-US/firefox/addon/excalibur-dev-tools/
      name: 'Table',
      collisionType: CollisionType.Fixed
      // anchor: vec(0, 0), // Actors default center colliders and graphics with anchor (0.5, 0.5)
      // collisionType: CollisionType.Active, // Collision Type Active means this participates in collisions read more https://excaliburjs.com/docs/collisiontypes
    });

  }

  override onInitialize() {
    // Generally recommended to stick logic in the "On initialize"
    // This runs before the first update
    // Useful when
    // 1. You need things to be loaded like Images for graphics
    // 2. You need excalibur to be initialized & started 
    // 3. Deferring logic to run time instead of constructor time
    // 4. Lazy instantiation
    const tableSprite = Resources.Table.toSprite();
    this.graphics.add(new GraphicsGroup({
      members: [
        { graphic: tableSprite, offset: Vector.Zero },
        { graphic: Resources.Dots.toSprite(), offset: vec(21, 20) }
      ]
    }))
    const tableCollider = [
      ...build_table_collider(tableSprite.width, tableSprite.height),
      ...build_cushion_collider()
    ]
    this.collider.useCompositeCollider(tableCollider);
    this.addComponent(new ColliderPaintingComponent());

    const holePositions = [vec(-516, -262), vec(-6, -275), vec(508, -262), vec(-516, 262), vec(-6, 275), vec(508, 262)];
    holePositions.forEach((pos) => {
      const hole = new Hole({ pos, radius: 30 });
      this.addChild(hole);
    });
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Put any update logic here runs every frame before Actor builtins
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
    // Called when a pair of objects are in contact
  }

  override onCollisionEnd(self: Collider, other: Collider, side: Side, lastContact: CollisionContact): void {
    // Called when a pair of objects separates
  }
}
