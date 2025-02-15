import { Color, DisplayMode, Engine, FadeInOut, SolverStrategy } from "excalibur";
import { loader } from "./resources";
import { Game } from "./level";

// Goal is to keep main.ts small and just enough to configure the engine

const game = new Engine({
  width: 1400, // Logical width and height in game pixels
  height: 800,
  displayMode: DisplayMode.FitScreen, // Display mode tells excalibur how to fill the window
  pixelArt: true, // pixelArt will turn on the correct settings to render pixel art without jaggies or shimmering artifacts
  suppressHiDPIScaling: true,
  scenes: {
    start: Game
  },
  physics: {
    solver: SolverStrategy.Realistic,
    // substep: 5 // Sub step the physics simulation for more robust simulations
  },
  fixedUpdateFps: 60 // Turn on fixed update timestep when consistent physic simulation is important
});

game.start('start', { // name of the start scene 'start'
  loader, // Optional loader (but needed for loading images/sounds)
  inTransition: new FadeInOut({ // Optional in transition
    duration: 1000,
    direction: 'in',
    color: Color.ExcaliburBlue
  })
}).then(() => {
  // Do something after the game starts
});