import Phaser from "phaser";

export default class About extends Phaser.Scene {
  private exitTime = 0;

  constructor() {
    super("about");
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
              #about {
                font-size: 50%;
                height: ${height - 10}px;
                width: ${width}px;
                display: flex;
                flex-direction: column;
                align-items: center;
                color: white;
              }
              #info {
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              #team {
                display: flex;
                flex-direction: row;
                gap: 5%;
              }
              .profile_pic {
                height: 4rem;
                width: 4rem;
                border-radius: 50%;
              }
              #team > div {
                display: flex;
                flex-direction: column;
                gap: 2%;
                align-items: center;
              }
              a {
                color: blue;
                background: linear-gradient(90deg, blue, purple, red, orange );
                background-clip: text;
                -webkit-background-clip: text;
              }
              a:hover {
                color: transparent;
                transition: 500ms ease;
              }
              #back {
                background-color: antiquewhite;
                padding: 2%;
                font-size: 3%;
                align-self: flex-start;
                margin: 3%;
              }
            </style>
            <div id="about">
              <div id="info">
                <h1>About the Game</h1>
                <a href="https://github.com/the-dark-room/the-dark-room" id="github"
                  target="_blank"
                  >Project Github</a
                >
                <p>
                  The Dark Room is a dungeon exploration game created using Phaser and ray casting. The
                  player is lost in a cultist dungeon and has to find their way out
                  by reading all the secret notes and finding the exit.
                </p>
              </div>
              <div id="team">
                <div>
                  <img
                    class="profile_pic"
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a8/Phoenix_bird_pattern.svg"
                  />
                  <h5>Joaquin (Jake) Lim</h5>
                  <a href="https://www.linkedin.com/in/joaquin-lim/" target="_blank">LinkedIn</a>
                </div>
                <div>
                  <img
                    class="profile_pic"
                    src="https://live.staticflickr.com/5570/14781131062_157632f51d_b.jpg"
                  />
                  <h5>James Johnson</h5>
                  <a href="https://www.linkedin.com/in/-jamesjohnson/" target="_blank">LinkedIn</a>
                </div>
                <div>
                  <img
                    class="profile_pic"
                    src="https://www.classicist.org/wp-content/uploads/2013/06/_pagebody/Chambers.jpg"
                  />
                  <h5>Daniel Lukonis</h5>
                  <a href="https://www.linkedin.com/in/daniellukonis/" target="_blank">LinkedIn</a>
                </div>
                <div>
                  <img
                    class="profile_pic"
                    src="https://cdn18.picryl.com/photo/2019/10/05/fox-and-two-hares-655124-1024.jpg"
                  />
                  <h5>Elijah Rhinehardt</h5>
                  <a href="https://www.linkedin.com/in/elijah-rhinehardt
                  " target="_blank">LinkedIn</a>
                </div>
              </div>
              <button name="back" id="back" type="button" >BACK</button>
            </div>
    `;
  }

  update() {}
}
