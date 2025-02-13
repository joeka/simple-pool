import { Engine, randomIntInRange, vec, Vector } from "excalibur";
import { Ball } from "./ball";

// Fisher-Yates shuffle
const shuffleArray = (array: unknown[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const flipEntries = (array: number[], element: number, targetIndex: number) => {
  const index = array.findIndex(e => e === element);
  const valA = array[index];
  const valB = array[targetIndex];
  array[targetIndex] = valA;
  array[index] = valB;
}

// ballRack is arranged as such (array index):
//        0
//       1 2
//     3  4  5
//   6  7  8  9 
// 10 11 12 13 14
//
export class BallSpawner {
  private ballRack: number[];

  constructor() {
    this.ballRack = [...Array(15).keys().map(e => e + 1)];
  
    shuffleArray(this.ballRack); //shuffle balls
    flipEntries(this.ballRack, 1, 0); //place 1 at the start
    flipEntries(this.ballRack, 8, 4); //place 8 in the middle
    const cornerA = randomIntInRange(1, 7); // choose random low ball
    const cornerB = randomIntInRange(9, 15); // choose random high ball
    flipEntries(this.ballRack, cornerA, 10); //place low ball at lower left
    flipEntries(this.ballRack, cornerB, 14); //place high ball at lower right
  }

  placeBalls(engine: Engine, startPosition: Vector, ballRadius: number) {
    const rowHeight = Math.sqrt(Math.pow(ballRadius * 2, 2) - Math.pow(ballRadius, 2));
    const totalNumberofRows = 5;
    var ballIndex = 0;
    // some leet code for placing balls in triangle shape
    for (var i = 0; i < totalNumberofRows; i++) {
      for (var j = 0; j < i + 1; j++) {
        const rowLeftShift = -(ballRadius * i);
        const relativePos = vec(rowLeftShift + (ballRadius * 2) * j, i * rowHeight);
        var pos = startPosition.add(relativePos);
        pos = pos.rotate(Math.PI / 2, startPosition); // rotate position so triangle is on it's side
        var ball = new Ball({
          number: this.ballRack[ballIndex],
          pos
        });
        engine.add(ball);
        ballIndex++;
      }
    }
  }
}