import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene
{
	constructor()
	{
		super('preloader')
	}

	preload()
	{
		this.load.image('tiles', 'tiles/watabou_pixel_dungeon_spritesheet.png')
		this.load.image('menuTiles', 'tiles/tilesetformattedupdate1.png')
		this.load.tilemapTiledJSON('dungeon', 'tiles/dungeon.json')
		this.load.tilemapTiledJSON('menumap', 'tiles/menumap.json')
		this.load.tilemapTiledJSON('map_jail', 'tiles/map_jail.json')
		this.load.tilemapTiledJSON('map_hallway', 'tiles/map_hallway.json')
		this.load.tilemapTiledJSON('map_maze', 'tiles/map_maze.json')
		this.load.tilemapTiledJSON('map_cultists', 'tiles/map_cultists.json')
		this.load.tilemapTiledJSON('map_bigEmpty', 'tiles/map_bigEmpty.json')


		this.load.image('stair-up', 'tiles/stair-up.png')
		this.load.image('stair-down', 'tiles/stair-down.png')

		this.load.atlas('faune', 'character/fauna.png', 'character/fauna.json')
		this.load.atlas('lizard', 'enemies/lizard.png', 'enemies/lizard.json')
		this.load.atlas('ghost', 'enemies/ghost.png', 'enemies/ghost.json') //GHOST
		this.load.atlas('bod', 'enemies/bod.png', 'enemies/bod.json') //BOD
		this.load.atlas('frog', 'enemies/frog.png', 'enemies/frog.json') //FROG
		this.load.atlas('skeleton', 'enemies/skeleton.png', 'enemies/skeleton.json') //SKELETON
		this.load.atlas('bat', 'enemies/bat.png', 'enemies/bat.json') //BAT
		this.load.atlas('cultist', 'enemies/cultist.png', 'enemies/cultist.json') //CULTIST
		this.load.atlas('chrisp', 'enemies/chrisp.png', 'enemies/chrisp.json') //CHRISP

		this.load.atlas('beartrap', 'traps/bearTrap.png', 'traps/bearTrap.json') //BEAR TRAP
		this.load.atlas('firetrap', 'traps/Fire-Trap.png', 'traps/Fire-Trap.json') //FIRE TRAP

		this.load.atlas('treasure', 'items/treasure.png', 'items/treasure.json')

		this.load.image('ui-heart-empty', 'ui/ui_heart_empty.png')
		this.load.image('ui-heart-full', 'ui/ui_heart_full.png')

		this.load.image('knife', 'weapons/weapon_knife.png')
		this.load.image('sword2', 'weapons/sword-slash/sword-slah2.png')
		this.load.image('sword3', 'weapons/sword-slash/sword-slah3.png')
		this.load.image('sword4', 'weapons/sword-slash/sword-slah4.png')

		// load the audio
		this.load.audio('menuMusic', 'audio/menumusic.mp3')
		this.load.audio('hurt-sound', 'audio/hurt-sound.mp3')
		this.load.audio('click', 'audio/click.mp3')
		this.load.audio('game-over', 'audio/game-over.mp3')
		this.load.audio('thriller-music', 'audio/thriller-music.mp3')
		this.load.audio('chrisp-hurt', 'audio/chrisp-hurt.mp3')

		// create loading bar
    let loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xbbbbbb // white
      }
    });

    /* For future use: to simulate a heavy load */
    // for(let i = 0; i < 100; i++) {
    //   console.log("HEEELELEEO");
    //   this.load.spritesheet('cat' + i, './assets/cat.png', {
    //     frameHeight: 32,
    //     frameWidth: 32
    //   });
    // }

		this.cameras.main.transparent = false
		this.cameras.main.setBackgroundColor('#000000')

		const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

		const text1 = this.make.text({
			x: screenCenterX,
			y: screenCenterY,
			text: 'Loading...',
			origin: { x: 0.5, y: 0.5 },
			scale: 2.5,
			style: {
					wordWrap: { width: this.cameras.main.width - 5 }
			}
		})
		text1.setTint(0x000000);

    this.load.on("progress", (percent: number) => {
		loadingBar.fillCircle(this.game.renderer.width / 2, this.game.renderer.height / 2, this.game.renderer.width / 2 * percent )
    })

    this.load.on("load", (file: Phaser.Loader.File) => {
    })
	}

	create()
	{
		this.scene.start('menu')
	}
}
