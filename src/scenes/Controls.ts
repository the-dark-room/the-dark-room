import Phaser from "phaser";

export default class Controls extends Phaser.Scene {
  private exitTime = 0;

  constructor() {
    super("controls");
  }

  preload() {}

  create() {
    const { width, height } = this.sys.game.canvas;
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    const html = this.about(width, height);
    console.log(height, width);

    let element = this.add
      .dom(screenCenterX, screenCenterX)
      .createFromHTML(html);
    element.addListener("click");

    // Used the pass on this context to the function
    const game = this;

    element.on("click", function (event) {
      if (event.target.name === "back") {
        game.scene.start("menu");
      }
    });
  }

  about(height, width) {
    return `
            <style>
              #controls{
                font-size: 45%;
                height: ${height - 5}px;
                width: ${width}px;
                display: flex;
                flex-direction: column;
                align-items: center;
                color: white;
              }
              #controls {
                display: flex;
                flex-direction: column;
                align-items: center;
                color: white;
              }
              .sub {
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              .image-text {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 5%;
              }
              img {
                border-radius: 50%;
                height: 2rem;
                width: 2rem;
                background-color: antiquewhite;
              }
              #back {
                background-color: antiquewhite;
                padding: 2%;
                font-size: 3%;
                align-self: flex-start;
                margin: 3%;
              }
            </style>
            <div id="controls">
              <h2>Controls</h2>
              <div class="sub">
                <h4>Movement</h4>
                <div class="image-text">
                  <img
                    src="https://cdn.dribbble.com/users/539773/screenshots/3892783/media/511a746e11b78cb3af03e83436bb002c.png?compress=1&resize=400x300"
                  />
                  <p>Use the WASD keys to move the player</p>
                </div>
              </div>
              <div class="sub">
                <h4>Combat</h4>
                <div class="image-text">
                  <div class="image-text">
                    <img src="https://freesvg.org/img/1464362757.png" />
                    <p>Press the left mouse button to slash enemies with your sword</p>
                  </div>
                  <div class="image-text">
                    <img src="https://freesvg.org/img/bayonet.png" />
                    <p>Press the space bar to throw a dagger a short distance</p>
                  </div>
                </div>
              </div>
              <div class="sub">
                <h4>Visibility</h4>
                <div class="image-text">
                  <img src="https://freesvg.org/img/HandTorch.png"/>
                  <p>Move your mouse cursor around the player to direct your torch</p>
                </div>

              </div>
            <button name="back" id="back" type="button" >BACK</button>
            </div>
    `;
  }

  update() {}
}
