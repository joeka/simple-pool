import { System, Query, SystemType, World, BodyComponent } from "excalibur";
import { ShootingComponent } from "../components/shooting";
import { Ball, BallType } from "../actors/ball";

export class GameLogicSystem extends System {
  shootingQuery: Query<typeof ShootingComponent>;
  bodyQuery: Query<typeof BodyComponent>;
  systemType: SystemType

  private ballsMoving: boolean = false
  private cueBallInGame: boolean = false

  constructor(world: World) {
    super();
    this.shootingQuery = world.query([ShootingComponent]);
    this.bodyQuery = world.query([BodyComponent]);
    this.systemType = SystemType.Update;
  }
  
  update(delta: number) {
    this.ballsMoving = false
    this.cueBallInGame = false

    for (let entity of this.bodyQuery.entities) {
      const body = entity.get(BodyComponent);
      if (body.owner?.hasTag("Ball")) {
        const ball = body.owner as Ball;
        const thatBallMoving = !ball.isStill();
        
        this.ballsMoving = this.ballsMoving || thatBallMoving;
        this.cueBallInGame = this.cueBallInGame || (ball.type === BallType.Cue && !ball.holed)
      }
    }

    for (let entity of this.shootingQuery.entities) {
      const shooting = entity.get(ShootingComponent);
      shooting.setActive(!this.ballsMoving && this.cueBallInGame);
    }
  }
}
