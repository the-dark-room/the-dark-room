import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene
{
	constructor()
	{
		super('preloader')
	}

	preload()
	{
		// this.load.image('tiles', 'tiles/dungeon_tiles_extruded.png')
		// this.load.tilemapTiledJSON('dungeon', 'tiles/dungeon-01.json')

		this.load.image('tiles', 'tiles/watabou_pixel_dungeon_spritesheet.png')
		this.load.image('menuTiles', 'tiles/tilesetformattedupdate1.png')
		this.load.tilemapTiledJSON('dungeon', 'tiles/dungeon.json')
		this.load.tilemapTiledJSON('menumap', 'tiles/menumap.json')

		this.load.atlas('faune', 'character/fauna.png', 'character/fauna.json')
		this.load.atlas('lizard', 'enemies/lizard.png', 'enemies/lizard.json')
		this.load.atlas('ghost', 'enemies/ghost.png', 'enemies/ghost.json') //GHOST
		this.load.atlas('bod', 'enemies/bod.png', 'enemies/bod.json') //BOD
		this.load.atlas('frog', 'enemies/frog.png', 'enemies/frog.json') //FROG
		this.load.atlas('skeleton', 'enemies/skeleton.png', 'enemies/skeleton.json') //SKELETON
		this.load.atlas('treasure', 'items/treasure.png', 'items/treasure.json')

		this.load.image('ui-heart-empty', 'ui/ui_heart_empty.png')
		this.load.image('ui-heart-full', 'ui/ui_heart_full.png')

		this.load.image('knife', 'weapons/weapon_knife.png')

		// load the audio
		this.load.audio('menuMusic', 'audio/menumusic.mp3')
		this.load.audio('hurt-sound', 'audio/hurt-sound.mp3')
		this.load.audio('click', 'audio/click.mp3')
		this.load.audio('game-over', 'audio/game-over.mp3')
		this.load.audio('thriller-music', 'audio/thriller-music.mp3')

		// create loading bar
    let loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff // white
      }
    });

    /*to simulate a heavy load */
    // for(let i = 0; i < 100; i++) {
    //   console.log("HEEELELEEO");
    //   this.load.spritesheet('cat' + i, './assets/cat.png', {
    //     frameHeight: 32,
    //     frameWidth: 32
    //   });
    // }

    this.load.on("progress", (percent: number) => {
      loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50)
      // console.log(percent);
    })

    
    this.load.on("load", (file: Phaser.Loader.File) => {
      // console.log(file.src);
    })
	}

	create()
	{
		// this.scene.start('game')
		this.scene.start('menu')
	}
}