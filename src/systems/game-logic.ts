import { System, Query, SystemType, World, TagQuery } from "excalibur";
import { ShootingComponent } from "../components/shooting";
import { BallInHandComponent } from "../components/ball-in-hand";
import { Ball, BallType } from "../actors/ball";

export enum GameState {
  Start,
  Shooting,
  Rolling,
  BallInHand
}

export class GameLogicSystem extends System {
  shootingQuery: Query<typeof ShootingComponent>;
  ballInHandQuery: Query<typeof BallInHandComponent>;
  ballQuery: TagQuery<"Ball">;
  systemType: SystemType;
  state: GameState;

  constructor(world: World) {
    super();
    this.state = GameState.Start;

    this.shootingQuery = world.query([ShootingComponent]);
    this.ballInHandQuery = world.query([BallInHandComponent]);
    this.ballQuery = world.queryTags(["Ball"]);
    this.systemType = SystemType.Update;
  }

  update(_delta: number) {
    switch (this.state) {
      case GameState.Start:
        // TODO: ball placement along the line?
        this.activateShooting();
      case GameState.Shooting:
        this.shooting();
        break;
      case GameState.Rolling:
        this.rolling();
        break;
      case GameState.BallInHand:
        this.ballInHand();
        break;
    }
  }

  rolling() {
    let ballInHand = false;

    for (let ball of this.ballQuery.entities as Ball[]) {
      if (!ball.isStill()) {
        // still rolling
        return;
      }

      if (ball.type === BallType.Cue && ball.holed) {
        ballInHand = true;
      }
    }

    if (ballInHand) {
      this.activateBallInHand();
    } else {
      this.activateShooting();
    }
  }

  private activateShooting() {
    const shooting = this.shootingQuery.entities[0].get(ShootingComponent);
    shooting.setActive(true);
    this.state = GameState.Shooting;
  }

  private shooting() {
    const shooting = this.shootingQuery.entities[0].get(ShootingComponent);
    if (!shooting.isActive()) {
      this.state = GameState.Rolling;
    }
  }

  private activateBallInHand() {
    const ballInHand = this.ballInHandQuery.entities[0].get(BallInHandComponent);
    ballInHand.setActive(true);
    this.state = GameState.BallInHand;
  }

  private ballInHand() {
    const ballInHand = this.ballInHandQuery.entities[0].get(BallInHandComponent);
    if (!ballInHand.isActive()) {
      this.state = GameState.Rolling;
    }
  }
}
