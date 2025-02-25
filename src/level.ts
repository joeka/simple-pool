import { DefaultLoader, Engine, ExcaliburGraphicsContext, Scene, SceneActivationContext, vec } from "excalibur";
import { Table } from "./actors/table";
import { Ball } from "./actors/ball";
import { BallSpawner } from "./ball-spawner";
import { GameLogicSystem } from "./systems/game-logic";
import { NetworkingSystem } from "./systems/networking";

export class Game extends Scene {
    override onInitialize(engine: Engine): void {
        // Scene.onInitialize is where we recommend you perform the composition for your game
        const table = new Table();
        table.pos = vec(engine.halfCanvasWidth, engine.halfCanvasHeight);
        this.add(table); // Actors need to be added to a scene to be drawn

        const ballSpawner = new BallSpawner();
        ballSpawner.placeBalls(engine, vec(500, 400), Ball.radius);
        const cueBall = new Ball({ pos: vec(975, 400) });
        this.add(cueBall);

        this.world.add(GameLogicSystem);
        this.world.add(NetworkingSystem);
    }

    override onPreLoad(loader: DefaultLoader): void {
        // Add any scene specific resources to load
    }

    override onActivate(context: SceneActivationContext<unknown>): void {
        // Called when Excalibur transitions to this scene
        // Only 1 scene is active at a time
    }

    override onDeactivate(context: SceneActivationContext): void {
        // Called when Excalibur transitions away from this scene
        // Only 1 scene is active at a time
    }

    override onPreUpdate(engine: Engine, elapsedMs: number): void {
        // Called before anything updates in the scene
    }

    override onPostUpdate(engine: Engine, elapsedMs: number): void {
        // Called after everything updates in the scene
    }

    override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
        // Called before Excalibur draws to the screen
    }

    override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
        // Called after Excalibur draws to the screen
    }
}