import Phaser from "phaser";
// import { createLizardAnims } from '../anims/EnemyAnims'
import { createCharacterAnims } from "../anims/CharacterAnims";
import { createChestAnims } from "../anims/TreasureAnims";
import "../characters/Faune";
import Faune from "../characters/Faune";
// import Lizard from '../enemies/Lizard'
import Chest from "../items/Chest";
import { sceneEvents } from "../events/EventsCenter";

export default class Menu extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Faune;
  private knives!: Phaser.Physics.Arcade.Group;
  private lizards!: Phaser.Physics.Arcade.Group;

  private playerLizardsCollider?: Phaser.Physics.Arcade.Collider;

  constructor() {
    super("menu");
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    // creating the menu screen

    createCharacterAnims(this.anims);

    let playButton = this.add
      .text(
        (this.game.renderer.width / 2) * 0.35,
        this.game.renderer.height * 0.2,
        "Start Game",
        { fontSize: 30 }
      )
      .setDepth(1);
    let controlsButton = this.add
      .text(
        (this.game.renderer.width / 2) * 0.55,
        this.game.renderer.height * 0.35,
        "Controls",
        { fontSize: 20 }
      )
      .setDepth(1);

    let aboutButton = this.add
      .text(
        (this.game.renderer.width / 2) * 0.55,
        this.game.renderer.height * 0.45,
        "About Us",
        { fontSize: 20 }
      )
      .setDepth(1);

    // create audio, pauses when game not in focus
    this.sound.pauseOnBlur = true;
    const menuMusic = this.sound.add("menuMusic", {
      loop: true,
      volume: 0.1,
    });

    // actually plays the audio (we do it like this so we can STOP it later)
    menuMusic.play();

    // add the map and tileset
    const map = this.make.tilemap({ key: "menumap" });
    // const tileset = map.addTilesetImage('tilesetformattedupdate1', 'menuTiles')
    const tileset = map.addTilesetImage(
      "watabou_pixel_dungeon_spritesheet",
      "tiles"
    );
    map.createLayer("background", tileset);

    // interactivity
    playButton.setInteractive();
    aboutButton.setInteractive();
    controlsButton.setInteractive();

    playButton.on("pointerup", () => {
      menuMusic.stop(); // stop the MENU music so we can transition to another track
      this.sound.play("click", {
        volume: 0.4,
      });
      this.scene.start("game");
    });

    aboutButton.on("pointerup", () => {
      menuMusic.stop();
      this.sound.play("click", {
        volume: 0.4,
      });
      this.scene.start("about");
    });

    controlsButton.on("pointerup", () => {
      menuMusic.stop();
      this.sound.play("click", {
        volume: 0.4,
      });
      this.scene.start("controls");
    });

    const wallsLayer = map.createLayer("Walls", tileset);
    wallsLayer.setCollisionByProperty({ collides: true });
  }

  update(t: number, dt: number) {
    // if (this.faune) {
    // 	this.faune.update(this.cursors)
    // }
  }
}
