import Phaser from "phaser";

export default class EnterName extends Phaser.Scene {
  private exitTime = 0;

  constructor() {
    super("entername");
  }

  preload() {
    this.load.html("nameform", "nameForm.html");
  }

  create() {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    this.exitTime = this.scene.settings.data.currentTime;

    // const text1 = this.add
    //   .text(screenCenterX, screenCenterY, `Your score was ${this.exitTime}`)
    //   .setOrigin(0.5);
    // text1.setTint(0xff00ff, 0xff0000, 0xff00ff, 0xff0000);
    let element = this.add.dom(100, 100).createFromCache("nameform");
    // console.log(this.scene)
  }

  update() {}
}
