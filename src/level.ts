import { DefaultLoader, Engine, ExcaliburGraphicsContext, Scene, SceneActivationContext, vec } from "excalibur";
import { Table } from "./table";
import { Ball } from "./ball";
import { CueBall } from "./cue_ball";

export class Game extends Scene {
    override onInitialize(engine: Engine): void {
        // Scene.onInitialize is where we recommend you perform the composition for your game
        const table = new Table();
        this.add(table); // Actors need to be added to a scene to be drawn

        const ball1 = new Ball({ number: 1, pos: vec(200, 400) });
        const ball8 = new Ball({ number: 8, pos: vec(300, 400) });
        const cueBall = new CueBall({ pos: vec(830, 400) });
        this.add(ball1)
        this.add(ball8)
        this.add(cueBall)
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