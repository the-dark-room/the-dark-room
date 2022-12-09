import Phaser from "phaser";

export default class Winner extends Phaser.Scene {
  private exitTime = 0;

  constructor() {
    super("winner");
    // console.log(this)
  }

  preload() {
    // console.log(this)
  }

  create() {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
    // const loadingText = this.add.text(screenCenterX, screenCenterY, 'Loading: 0%').setOrigin(0.5);

    this.exitTime = this.scene.settings.data.currentTime;

    const text1 = this.add
      .text(
        screenCenterX,
        screenCenterY,
        `You escaped in ${this.exitTime} seconds`
      )
      .setOrigin(0.5);
    text1.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
    // console.log(this.scene)
    setTimeout(() => {
      // this.scene.start("entername", { currentTime: this.exitTime });
      this.scene.start("about", { currentTime: this.exitTime });
    }, 4000);
  }

  update() {}
}
