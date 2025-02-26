import { System, Query, SystemType, World, TagQuery } from "excalibur";
import { ShootingComponent } from "../components/shooting";
import { BallInHandComponent } from "../components/ball-in-hand";
import { Ball, BallType } from "../actors/ball";

export class GameLogicSystem extends System {
  shootingQuery: Query<typeof ShootingComponent>;
  ballInHandQuery: Query<typeof BallInHandComponent>;
  ballQuery: TagQuery<"Ball">;
  systemType: SystemType;

  constructor(world: World) {
    super();
    this.shootingQuery = world.query([ShootingComponent]);
    this.ballInHandQuery = world.query([BallInHandComponent]);
    this.ballQuery = world.queryTags(["Ball"]);
    this.systemType = SystemType.Update;
  }

  update(_delta: number) {
    let ballsMoving = false;
    let cueBallInGame = false;
    let ballInHand = false;

    for (let ball of this.ballQuery.entities as Ball[]) {
      const thatBallMoving = !ball.isStill();

      ballsMoving = ballsMoving || thatBallMoving;

      if (ball.type === BallType.Cue) {
        ballInHand = ball.inHand;
        cueBallInGame = cueBallInGame || (!ball.holed && !ballInHand);
      }

    }

    const ballInHandComponent = this.ballInHandQuery.entities[0].get(BallInHandComponent);
    ballInHandComponent.setActive(!ballsMoving && ballInHand);
    const shooting = this.shootingQuery.entities[0].get(ShootingComponent);
    shooting.setActive(!ballsMoving && cueBallInGame);
  }
}
