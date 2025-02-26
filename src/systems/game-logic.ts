import { System, Query, SystemType, World } from "excalibur";
import { ShootingComponent } from "../components/shooting";
import { Ball } from "../actors/ball";

export class GameLogicSystem extends System {
  shootingQuery: Query<typeof ShootingComponent>;
  balls: Ball[];
  cueBall: Ball;
  systemType: SystemType;

  private ballsMoving: boolean = false;

  constructor(world: World) {
    super();
    this.shootingQuery = world.query([ShootingComponent]);
    this.balls = world.queryTags(["Ball"]).entities as Ball[];
    this.cueBall = world.queryTags(["Cue"]).entities[0] as Ball;
    this.systemType = SystemType.Update;
  }

  update(delta: number) {
    this.ballsMoving = false
    for (let ball of this.balls) {
      const thatBallMoving = !ball.isStill();
      this.ballsMoving = this.ballsMoving || thatBallMoving;
    }

    for (let entity of this.shootingQuery.entities) {
      const shooting = entity.get(ShootingComponent);
      shooting.setActive(!this.ballsMoving && !this.cueBall.holed);
    }
  }
}
