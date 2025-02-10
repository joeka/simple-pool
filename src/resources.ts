import { Color, ImageSource, Loader } from "excalibur";

// It is convenient to put your resources in one place
export const Resources = {
  CueBall: new ImageSource("./images/ball_16.png"), // Vite public/ directory serves the root images
  Ball1: new ImageSource("./images/ball_1.png"),
  Ball2: new ImageSource("./images/ball_2.png"),
  Ball3: new ImageSource("./images/ball_3.png"),
  Ball4: new ImageSource("./images/ball_4.png"),
  Ball5: new ImageSource("./images/ball_5.png"),
  Ball6: new ImageSource("./images/ball_6.png"),
  Ball7: new ImageSource("./images/ball_7.png"),
  Ball8: new ImageSource("./images/ball_8.png"),
  Ball9: new ImageSource("./images/ball_9.png"),
  Ball10: new ImageSource("./images/ball_10.png"),
  Ball11: new ImageSource("./images/ball_11.png"),
  Ball12: new ImageSource("./images/ball_12.png"),
  Ball13: new ImageSource("./images/ball_13.png"),
  Ball14: new ImageSource("./images/ball_14.png"),
  Ball15: new ImageSource("./images/ball_15.png"),
  Cue: new ImageSource("./images/cue.png"),
  Table: new ImageSource("./images/table.png"),
  Dots: new ImageSource("./images/dots.png")
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
