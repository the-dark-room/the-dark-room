import Phaser from "phaser";
import { createCharacterAnims } from '../anims/CharacterAnims'
import '../characters/Faune'
import Faune from '../characters/Faune'

export default class Menu extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private faune!: Faune

  constructor() {
    super('menu');
  }
  init() {
  }
  
  preLoad() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() { // creating the menu screen

    let playButton = this.add.text((this.game.renderer.width / 2) *.35, this.game.renderer.height * 0.20, 'Start Game', {fontSize: 30}).setDepth(1)
    let aboutButton = this.add.text((this.game.renderer.width / 2) *.55, this.game.renderer.height * 0.35, 'About Us', {fontSize: 20}).setDepth(1)

    // create audio, disable pauseOnBlur
    // this.sound.pauseOnBlur = false;
    // this.sound.play(CST.AUDIO.TITLE, {
    //   loop: true,
    //   volume: 0.1
    // })

    // add the map and tileset
    const map = this.make.tilemap({ key: 'menumap' })
    // const tileset = map.addTilesetImage('tilesetformattedupdate1', 'menuTiles')
    const tileset = map.addTilesetImage('watabou_pixel_dungeon_spritesheet', 'tiles')
    map.createStaticLayer('background', tileset)

    

    // interactivity
    playButton.setInteractive();
    aboutButton.setInteractive();

    playButton.on("pointerup", () => {
      this.scene.start('game')
      console.log('clickcy');
    })

    aboutButton.on("pointerup", () => {
      // this.scene.start('game')
      alert(`There be pirates here`)
    })

    // initialize the player
    // createCharacterAnims(this.anims)
    // this.faune = this.add.faune(128, 128, 'faune')
    // this.faune.setCollideWorldBounds(true) // collides with the world's border
    // this.faune.setDepth(999) // sets the z-index for the player sprite, (putting it above everything else)
    // // this.cameras.main.startFollow(this.faune, true)
    
    const wallsLayer = map.createStaticLayer('Walls', tileset)
		wallsLayer.setCollisionByProperty({ collides: true })
    this.physics.add.collider(this.faune, wallsLayer)

    
  }
  
  // update(t: number, dt: number) {
	// 	if (this.faune) {
	// 		this.faune.update(this.cursors)
	// 	}
	// }
}