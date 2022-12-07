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
      <input type="text" name="nameField" placeholder="Initials" maxLength="3" style="font-size: 5%">
      <input type="button" name="playButton" value="Submit" style="font-size: 5% ">
      `;

    const text1 = this.add
      .text(
        screenCenterX,
        screenCenterY - screenCenterY / 4,
        `Your score was ${this.exitTime}`
      )
      .setOrigin(0.5);
    text1.setTint(0xff00ff, 0xff0000, 0xff00ff, 0xff0000);
    const text2 = this.add
      .text(
        screenCenterX,
        screenCenterY,
        "Enter your initials for the Leaderboard"
      )
      .setOrigin(0.5);
    text2.setTint(0xff00ff, 0xff0000, 0xff00ff, 0xff0000);
    let element = this.add
      .dom(screenCenterX, screenCenterY + screenCenterY / 4)
      .createFromHTML(form);

    element.addListener("click");

    element.on("click", function (event) {
      if (event.target.name === "playButton") {
        console.log("Success!");
      }
    });
  }

  update() {}
}
