import Phaser from 'phaser'

import { debugDraw } from '../utils/debug'
// import { createLizardAnims } from '../anims/EnemyAnims'
import createGhostAnims from '../anims/GhostAnims'  //GHOST
import createBodAnims from '../anims/BodAnims'  //BOD
import createFrogAnims from '../anims/FrogAnims'	//FROG
import createSkeletonAnims from '../anims/SkeletonAnims'	//SKELETON
import createBatAnims from '../anims/BatAnims'  //BAT
import { createCharacterAnims } from '../anims/CharacterAnims'
import { createChestAnims } from '../anims/TreasureAnims'

// import Lizard from '../enemies/Lizard'
import Ghost from '../enemies/Ghost'  //GHOST
import Bod from '../enemies/Bod'	//BOD
import Frog from '../enemies/Frog'	//FROG
import Skeleton from '../enemies/Skeleton'	//SKELETON
import Bat from '../enemies/Bat'	//BAT

import '../characters/Faune'
import Faune from '../characters/Faune'

import { sceneEvents } from '../events/EventsCenter'
import Chest from '../items/Chest'

export default class Game extends Phaser.Scene {
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
	private faune!: Faune

	private knives!: Phaser.Physics.Arcade.Group
	// private lizards!: Phaser.Physics.Arcade.Group
	private ghosts!: Phaser.Physics.Arcade.Group   //GHOST
	private bods!: Phaser.Physics.Arcade.Group   //BOD
	private frogs!: Phaser.Physics.Arcade.Group   //FROG
	private skeletons!: Phaser.Physics.Arcade.Group   //SKELETON
	private bats!: Phaser.Physics.Arcade.Group   //BAT

	// private playerLizardsCollider?: Phaser.Physics.Arcade.Collider

	constructor() {
		super('game')
	}

	preload() {
		this.cursors = this.input.keyboard.createCursorKeys()
	}

	create() {
		// main music
		const thrillerMusic = this.sound.add('thriller-music', {
			loop: true,
			volume: 0.2
		})
		thrillerMusic.play()

		this.scene.run('game-ui')

		createCharacterAnims(this.anims)
		// createLizardAnims(this.anims)
		createGhostAnims(this.anims)  //GHOST
		createBodAnims(this.anims)  //BOD
		createFrogAnims(this.anims)	//FROG
		createSkeletonAnims(this.anims)	//SKELETON
		createBatAnims(this.anims)  //BAT
		createChestAnims(this.anims)

		// adds the map and the tiles for it
		const map = this.make.tilemap({ key: 'dungeon' })
		const tileset = map.addTilesetImage('watabou_pixel_dungeon_spritesheet', 'tiles')

		map.createLayer('background', tileset)

		this.knives = this.physics.add.group({
			classType: Phaser.Physics.Arcade.Image,
			maxSize: 200
		})

		this.faune = this.add.faune(128, 128, 'faune')
		this.faune.setKnives(this.knives)

		// // smaller hitbox
		// this.faune.setSize(10, 12).setOffset(12,15)
		this.faune.setDepth(999)

		const wallsLayer = map.createLayer('Walls', tileset)

		wallsLayer.setCollisionByProperty({ collides: true })

		const chests = this.physics.add.staticGroup({
			classType: Chest
		})
		const chestsLayer = map.getObjectLayer('chests')
		chestsLayer.objects.forEach(chestObj => {
			chests.get(chestObj.x! + chestObj.width! * 0.5, chestObj.y! - chestObj.height! * 0.5, 'treasure')
		})

		this.cameras.main.startFollow(this.faune, true)


		/*
		** ENEMIES
		*/


		// this.lizards = this.physics.add.group({
		// 	classType: Lizard,
		// 	createCallback: (go) => {
		// 		const lizGo = go as Lizard
		// 		lizGo.body.onCollide = true
		// 	}
		// })

		// const lizardsLayer = map.getObjectLayer('Lizards')
		// lizardsLayer.objects.forEach(lizObj => {
		// 	this.lizards.get(lizObj.x! + lizObj.width! * 0.5, lizObj.y! - lizObj.height! * 0.5, 'lizard')
		// })


		this.ghosts = this.physics.add.group({  //GHOST
			classType: Ghost
		})
		
	

		this.bods = this.physics.add.group({  //BOD
			classType: Bod
		})
		
	
6
		this.frogs = this.physics.add.group({  //FROG
			classType: Frog
		})
		
	

		this.skeletons = this.physics.add.group({  //SKELETONS
			classType: Skeleton
		})
		


		this.bats = this.physics.add.group({  //BAT
			classType: Bat
		})
		for(let b = 0; b < 50; b++){
			const x = Phaser.Math.Between(20, 980)
			const y = Phaser.Math.Between(20, 980)
			this.ghosts.get( x, y, 'ghost').setScale(0.6)
			this.bods.get( x, y, 'bod').setScale(0.4)
			this.frogs.get( x, y, 'frog').setScale(0.8)
			this.skeletons.get( x, y, 'skeleton')
			this.bats.get( x, y, `bat-${b}`)
		}
		console.log(this.physics)
		// this.bats.get( 100, 100, 'bat')



		/*
		** ENEMIES
		*/


		this.physics.add.collider(this.faune, wallsLayer)
		// this.physics.add.collider(this.lizards, wallsLayer)
		this.physics.add.collider(this.ghosts, wallsLayer)  //GHOST
		this.physics.add.collider(this.bods, wallsLayer)  //BOD
		this.physics.add.collider(this.frogs, wallsLayer)  //FROG
		this.physics.add.collider(this.skeletons, wallsLayer)  //SKELETON
		this.physics.add.collider(this.bats, wallsLayer)  //BAT

		this.physics.add.collider(this.faune, chests, this.handlePlayerChestCollision, undefined, this)

		this.physics.add.collider(this.knives, wallsLayer, this.handleKnifeWallCollision, undefined, this)
		// this.physics.add.collider(this.knives, this.lizards, this.handleKnifeLizardCollision, undefined, this)

		// this.playerLizardsCollider = this.physics.add.collider(this.lizards, this.faune, this.handlePlayerLizardCollision, undefined, this)
	}

	private handlePlayerChestCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
		const chest = obj2 as Chest
		this.faune.setChest(chest)
	}

	private handleKnifeWallCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
		this.knives.killAndHide(obj1)
	}

	// private handleKnifeLizardCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
	// 	this.knives.killAndHide(obj1)
	// 	this.lizards.killAndHide(obj2)
	// 	this.lizards.remove(obj2) // removes the sprite from the group, rendering it harmless
	// }

	// private handlePlayerLizardCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
	// 	const lizard = obj2 as Lizard

	// 	const dx = this.faune.x - lizard.x
	// 	const dy = this.faune.y - lizard.y

	// 	const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

	// 	this.faune.handleDamage(dir)
	// 	// damage sound
	// 	this.sound.play('hurt-sound', {
	// 		volume: 0.2
	// 	})

	// 	sceneEvents.emit('player-health-changed', this.faune.health)

	// 	if (this.faune.health <= 0){
	// 		const deathSound = this.sound.add('game-over', {
	// 			volume: 2
	// 		})
	// 		setTimeout(() => {
	// 			deathSound.play()
	// 		}, 600)

	// 		this.playerLizardsCollider?.destroy()
	// 	}
	// }
	
	update(t: number, dt: number) {
		if (this.faune) {
			this.faune.update(this.cursors)
		}
	}
}
