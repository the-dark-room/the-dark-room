import Phaser from "phaser";

export default class Winner extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private exitTime = 0;


  constructor() {
    super("winner");
  }

  preload() {
  }

  create() {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    this.exitTime = this.scene.settings.data.currentTime;

    const text1 = this.add
      .text(
        screenCenterX,
        screenCenterY,
        `You escaped in ${this.exitTime} seconds`
      )
      .setOrigin(0.5);
    text1.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
    setTimeout(() => {
      this.scene.start("entername", { currentTime: this.exitTime });
    }, 4000);
  }

  update() {}
}
