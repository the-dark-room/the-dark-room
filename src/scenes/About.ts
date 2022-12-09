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
  }

  about(height, width) {
    return `
            <style>
              #about {
                font-size: 5%;
                height: ${height - 150}px;
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
                height: 5%;
                width: 5%;
              }
              #team > div {
                display: flex;
                flex-direction: column;
                gap: 2%;
                align-items: center;
              }
              h1 {
                text-size: 3px;
              }
              a {
              }
            </style>
            <div id="about">
              <div id="info">
                <h1>About the Game</h1>
                <a href="https://github.com/the-dark-room/the-dark-room" id="github"
                  >Project Github</a
                >
                <p>
                  The Dark Room is a dungeon exploration game created using phaser. The
                  player is is lost in a cultist dungeon and has to find their way out
                  by reading all the secret notes and finding the exit. The game is
                  created using phaser with the flash light using ray casting to detect
                  walls.
                </p>
              </div>
              <div id="team">
                <div>
                  <img
                    class="profile_pic"
                    src="https://live.staticflickr.com/7024/6671465981_84bf3d94b0_b.jpg"
                  />
                  <h3>Name Here</h3>
                  <a href="https://www.linkedin.com/">LinkedIn</a>
                </div>
                <div>
                  <img
                    class="profile_pic"
                    src="https://live.staticflickr.com/7024/6671465981_84bf3d94b0_b.jpg"
                  />
                  <h3>Name Here</h3>
                  <a href="https://www.linkedin.com/">LinkedIn</a>
                </div>
                <div>
                  <img
                    class="profile_pic"
                    src="https://live.staticflickr.com/7024/6671465981_84bf3d94b0_b.jpg"
                  />
                  <h3>Name Here</h3>
                  <a href="https://www.linkedin.com/">LinkedIn</a>
                </div>
                <div>
                  <img
                    class="profile_pic"
                    src="https://live.staticflickr.com/7024/6671465981_84bf3d94b0_b.jpg"
                  />
                  <h3>Name Here</h3>
                  <a href="https://www.linkedin.com/">LinkedIn</a>
                </div>
              </div>
            </div>
    `;
  }

  update() {}
}
