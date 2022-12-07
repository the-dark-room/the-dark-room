import Phaser from "phaser";
// import { createLizardAnims } from '../anims/EnemyAnims'
import { createCharacterAnims } from '../anims/CharacterAnims'
import { createChestAnims } from '../anims/TreasureAnims'
import '../characters/Faune'
import Faune from '../characters/Faune'
// import Lizard from '../enemies/Lizard'
import Chest from '../items/Chest'
import { sceneEvents } from '../events/EventsCenter'

export default class Menu extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private faune!: Faune
  private knives!: Phaser.Physics.Arcade.Group
	private lizards!: Phaser.Physics.Arcade.Group

	private playerLizardsCollider?: Phaser.Physics.Arcade.Collider

  constructor() {
    super('menu');
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() { // creating the menu screen

    createCharacterAnims(this.anims)

		// this.knives = this.physics.add.group({
		// 	classType: Phaser.Physics.Arcade.Image,
		// 	maxSize: 200
		// })


    let playButton = this.add.text((this.game.renderer.width / 2) *.35, this.game.renderer.height * 0.20, 'Start Game', {fontSize: 30}).setDepth(1)
    let aboutButton = this.add.text((this.game.renderer.width / 2) *.55, this.game.renderer.height * 0.35, 'About Us', {fontSize: 20}).setDepth(1)

    // create audio, pauses when game not in focus
    this.sound.pauseOnBlur = true;
    const menuMusic = this.sound.add('menuMusic', {
      loop: true,
      volume: 0.1
    })

		// actually plays the audio (we do it like this so we can STOP it later)
		menuMusic.play()

    // add the map and tileset
    const map = this.make.tilemap({ key: 'menumap' })
    // const tileset = map.addTilesetImage('tilesetformattedupdate1', 'menuTiles')
    const tileset = map.addTilesetImage('watabou_pixel_dungeon_spritesheet', 'tiles')
    map.createLayer('background', tileset)



    // interactivity
    playButton.setInteractive();
    aboutButton.setInteractive();

    playButton.on("pointerup", () => {
			menuMusic.stop() // stop the MENU music so we can transition to another track
			this.sound.play('click', {
				volume: 0.4
			})
      this.scene.start('game')
    })

    aboutButton.on("pointerup", () => {
      // this.scene.start('game')
			this.sound.play('click', {
				volume: 0.4
			})
      alert(`Boo`)
    })

    // initialize the player
    // this.faune = this.add.faune(128, 128, 'faune')
    // this.faune.setCollideWorldBounds(true) // collides with the world's border
    // this.faune.setDepth(999) // sets the z-index for the player sprite, (putting it above everything else)

    // this.faune.setKnives(this.knives)
    // this.cameras.main.startFollow(this.faune, true)

    const wallsLayer = map.createLayer('Walls', tileset)
		wallsLayer.setCollisionByProperty({ collides: true })
    // this.physics.add.collider(this.faune, wallsLayer)


	}

  update(t: number, dt: number) {
		// if (this.faune) {
		// 	this.faune.update(this.cursors)
		// }
	}
}