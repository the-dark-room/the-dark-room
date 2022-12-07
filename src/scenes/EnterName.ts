import Phaser from "phaser";

export default class EnterName extends Phaser.Scene {
  private exitTime = 0;

  constructor() {
    super("entername");
  }

  preload() {
    this.load.html("nameform", "/nameForm.html");
  }

  create() {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    this.exitTime = this.scene.settings.data.currentTime;
    let form = `
<input type="text" name="nameField" placeholder="Enter your name" style="font-size: 32px">
<input type="button" name="playButton" value="Let's Play" style="font-size: 32px">
`;

    // this.add
    //   .dom(
    //     100,
    //     100,
    //     "div",
    //     "background-color:lime;width:220px;height:100px;font:48px Arial",
    //     "Phaser"
    //   )
    //   .setDepth(10);
    // const text1 = this.add
    //   .text(screenCenterX, screenCenterY, `Your score was ${this.exitTime}`)
    //   .setOrigin(0.5);
    // text1.setTint(0xff00ff, 0xff0000, 0xff00ff, 0xff0000);
    let element = this.add.dom(150, 150).createFromCache("nameform");
    // console.log(this.scene)
  }

  update() {}
}
