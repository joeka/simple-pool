import { Color, ImageSource, Loader } from "excalibur";

// It is convenient to put your resources in one place
export const Resources = {
  CueBall: new ImageSource("./images/ball_16.svg"), // Vite public/ directory serves the root images
  Ball1: new ImageSource("./images/ball_1.svg"),
  Ball2: new ImageSource("./images/ball_2.svg"),
  Ball3: new ImageSource("./images/ball_3.svg"),
  Ball4: new ImageSource("./images/ball_4.svg"),
  Ball5: new ImageSource("./images/ball_5.svg"),
  Ball6: new ImageSource("./images/ball_6.svg"),
  Ball7: new ImageSource("./images/ball_7.svg"),
  Ball8: new ImageSource("./images/ball_8.svg"),
  Ball9: new ImageSource("./images/ball_9.svg"),
  Ball10: new ImageSource("./images/ball_10.svg"),
  Ball11: new ImageSource("./images/ball_11.svg"),
  Ball12: new ImageSource("./images/ball_12.svg"),
  Ball13: new ImageSource("./images/ball_13.svg"),
  Ball14: new ImageSource("./images/ball_14.svg"),
  Ball15: new ImageSource("./images/ball_15.svg"),
  Cue: new ImageSource("./images/cue.svg"),
  Table: new ImageSource("./images/table.svg")
} as const; // the 'as const' is a neat typescript trick to get strong typing on your resources. 
// So when you type Resources.CueBall -> ImageSource


// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();
loader.backgroundColor = Color.ExcaliburBlue.toString();
loader.logo = new ImageSource("./images/simplelogo.png").path
loader.logoHeight = 270
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
