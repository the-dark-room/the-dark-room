import Phaser from 'phaser'

import { debugDraw } from '../utils/debug'

import createGhostAnims from '../anims/GhostAnims'  //GHOST
import createBodAnims from '../anims/BodAnims'  //BOD
import createFrogAnims from '../anims/FrogAnims'	//FROG
import createSkeletonAnims from '../anims/SkeletonAnims'	//SKELETON
import createBatAnims from '../anims/BatAnims'  //BAT
import createCultistAnims from '../anims/CultistAnims'  //CULTIST
import createChrispAnims from '../anims/ChrispAnims'  //CHRISP
import createBearTrapAnims from '../anims/BearTrapAnims'  //BEAR TRAP
import createFireTrapAnims from '../anims/FireTrapAnims'  //FIRE TRAP
import { createCharacterAnims } from '../anims/CharacterAnims'
import { createChestAnims } from '../anims/TreasureAnims'

import Ghost from '../enemies/Ghost'  //GHOST
import Bod from '../enemies/Bod'	//BOD
import Frog from '../enemies/Frog'	//FROG
import Skeleton from '../enemies/Skeleton'	//SKELETON
import Bat from '../enemies/Bat'	//BAT
import Cultist from '../enemies/Cultist'	//CULTIST
import Chrisp from '../enemies/Chrisp'	//CHRISP
import BearTrap from '../traps/BearTrap'	//BEAR TRAP
import FireTrap from '../traps/FireTrap'	//FIRE TRAP

import '../characters/Faune'
import Faune from '../characters/Faune'

import { sceneEvents } from '../events/EventsCenter'
import Chest from '../items/Chest'

export default class Game extends Phaser.Scene {
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
	private faune!: Faune

	private knives!: Phaser.Physics.Arcade.Group
	private meleeHitbox!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody

	private ghosts!: Phaser.Physics.Arcade.Group   //GHOST
	private bods!: Phaser.Physics.Arcade.Group   //BOD
	private frogs!: Phaser.Physics.Arcade.Group   //FROG
	private skeletons!: Phaser.Physics.Arcade.Group   //SKELETON
	private bats!: Phaser.Physics.Arcade.Group   //BAT
	private cultists!: Phaser.Physics.Arcade.Group   //CULTIST
	private chrisps!: Phaser.Physics.Arcade.Group   //CHRISP
	private beartraps!: Phaser.Physics.Arcade.StaticGroup   //BEAR TRAP
	private firetraps!: Phaser.Physics.Arcade.StaticGroup   //FIRE TRAP
	
	
	private playerGhostsCollider?: Phaser.Physics.Arcade.Collider
	private playerBodsCollider?: Phaser.Physics.Arcade.Collider 
	private playerFrogsCollider?: Phaser.Physics.Arcade.Collider 
	private playerSkeletonsCollider?: Phaser.Physics.Arcade.Collider
	private playerBatsCollider?: Phaser.Physics.Arcade.Collider 
	private playerCultistsCollider?: Phaser.Physics.Arcade.Collider 
	private playerChrispsCollider?: Phaser.Physics.Arcade.Collider 
	private playerBeartrapsCollider?: Phaser.Physics.Arcade.Collider 
	private playerFiretrapsCollider?: Phaser.Physics.Arcade.Collider 
	
	

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

		createGhostAnims(this.anims)  //GHOST
		createBodAnims(this.anims)  //BOD
		createFrogAnims(this.anims)	//FROG
		createSkeletonAnims(this.anims)	//SKELETON
		createBatAnims(this.anims)  //BAT
		createCultistAnims(this.anims)  //CULTIST
		createChrispAnims(this.anims)  //CHRISP
		createBearTrapAnims(this.anims)  //BEAR TRAP
		createFireTrapAnims(this.anims)  //FIRE TRAP
		createChestAnims(this.anims)

		// adds the map and the tiles for it
		const map = this.make.tilemap({ key: 'dungeon' })
		const tileset = map.addTilesetImage('watabou_pixel_dungeon_spritesheet', 'tiles')

		map.createLayer('background', tileset)

		this.knives = this.physics.add.group({
			classType: Phaser.Physics.Arcade.Image,
			maxSize: 200
		})

		// TODO: create sword swing hit box

		this.meleeHitbox = this.add.rectangle(0, 0, 20, 20, 0xffffff, 0) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody
		this.physics.add.existing(this.meleeHitbox)
		this.meleeHitbox.body.enable = false

		this.faune = this.add.faune(128, 128, 'faune')
		// this.faune.setSword(this.swordHitbox)
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


		


		this.ghosts = this.physics.add.group({  //GHOST
			classType: Ghost
		})
		this.bods = this.physics.add.group({  //BOD
			classType: Bod
		})
		this.frogs = this.physics.add.group({  //FROG
			classType: Frog
		})
		this.skeletons = this.physics.add.group({  //SKELETONS
			classType: Skeleton
		})
		this.bats = this.physics.add.group({  //BAT
			classType: Bat
		})
		this.cultists = this.physics.add.group({  //CULTIST
			classType: Cultist
		})
		this.chrisps = this.physics.add.group({  //CHRISP
			classType: Chrisp
		})
		this.beartraps = this.physics.add.staticGroup({  //BEAR TRAP
			classType: BearTrap
		})
		this.firetraps = this.physics.add.staticGroup({  //FIRE TRAP
			classType: FireTrap
		})


		// const lizardsLayer = map.getObjectLayer('Lizards')
				// lizardsLayer.objects.forEach(lizObj => {
				// 	this.lizards.get(lizObj.x! + lizObj.width! * 0.5, lizObj.y! - lizObj.height! * 0.5, 'lizard')
				// })

		function randCoord() {
			return Phaser.Math.Between(200, 900)
		}

		for(let b = 0; b < 10; b++){

			this.ghosts.get( randCoord(), randCoord(), 'ghost').setScale(0.8)
			this.bods.get( randCoord(), randCoord(), 'bod').setScale(0.5)
			this.frogs.get( randCoord(), randCoord(), 'frog')
			this.skeletons.get( randCoord(), randCoord(), 'skeleton')
			this.bats.get( randCoord(), randCoord(), `bat-${b}`)
			this.cultists.get( randCoord(), randCoord(), 'cultist').setScale(0.6)
			this.beartraps.get(randCoord(), randCoord(), 'beartrap').visible = false
			this.firetraps.get(randCoord(), randCoord(), 'firetrap').visible = false

		}
		this.chrisps.get(210, 200, 'chrisp')
		this.beartraps.get(100, 100, 'beartrap').visible = false
		this.firetraps.get(80, 80, 'firetrap').visible = false
		



		/*
		** ENEMIES
		*/


		this.physics.add.collider(this.faune, wallsLayer)

		this.physics.add.collider(this.ghosts, wallsLayer)  //GHOST
		this.physics.add.collider(this.bods, wallsLayer)  //BOD
		this.physics.add.collider(this.frogs, wallsLayer)  //FROG
		this.physics.add.collider(this.skeletons, wallsLayer)  //SKELETON
		this.physics.add.collider(this.bats, wallsLayer)  //BAT
		this.physics.add.collider(this.cultists, wallsLayer)  //CULTIST
		this.physics.add.collider(this.chrisps, wallsLayer)  //CHRISP

		this.physics.add.collider(this.faune, chests, this.handlePlayerChestCollision, undefined, this)

		this.physics.add.collider(this.knives, wallsLayer, this.handleKnifeWallCollision, undefined, this)
		this.physics.add.collider(this.knives, this.ghosts, this.handleKnifeEnemyCollision, undefined, this)
		this.physics.add.collider(this.knives, this.bods, this.handleKnifeEnemyCollision, undefined, this)
		this.physics.add.collider(this.knives, this.frogs, this.handleKnifeEnemyCollision, undefined, this)
		this.physics.add.collider(this.knives, this.skeletons, this.handleKnifeEnemyCollision, undefined, this)
		this.physics.add.collider(this.knives, this.chrisps, this.handleKnifeEnemyCollision, undefined, this)
		this.physics.add.collider(this.knives, this.cultists, this.handleKnifeEnemyCollision, undefined, this)
		this.physics.add.collider(this.knives, this.bats, this.handleKnifeEnemyCollision, undefined, this)

		this.physics.add.overlap(this.meleeHitbox, this.ghosts, this.handleSwordEnemyCollision, undefined, this)
		this.physics.add.overlap(this.meleeHitbox, this.bods, this.handleSwordEnemyCollision, undefined, this)
		this.physics.add.overlap(this.meleeHitbox, this.frogs, this.handleSwordEnemyCollision, undefined, this)
		this.physics.add.overlap(this.meleeHitbox, this.skeletons, this.handleSwordEnemyCollision, undefined, this)
		this.physics.add.overlap(this.meleeHitbox, this.chrisps, this.handleSwordEnemyCollision, undefined, this)
		this.physics.add.overlap(this.meleeHitbox, this.cultists, this.handleSwordEnemyCollision, undefined, this)
		this.physics.add.overlap(this.meleeHitbox, this.bats, this.handleSwordEnemyCollision, undefined, this)

		this.playerGhostsCollider = this.physics.add.collider(this.ghosts, this.faune, this.handlePlayerEnemyCollision, undefined, this)
		this.playerBodsCollider = this.physics.add.collider(this.bods, this.faune, this.handlePlayerEnemyCollision, undefined, this)
		this.playerFrogsCollider = this.physics.add.collider(this.frogs, this.faune, this.handlePlayerEnemyCollision, undefined, this)
		this.playerSkeletonsCollider = this.physics.add.collider(this.skeletons, this.faune, this.handlePlayerEnemyCollision, undefined, this)
		this.playerChrispsCollider = this.physics.add.collider(this.chrisps, this.faune, this.handlePlayerEnemyCollision, undefined, this)
		this.playerCultistsCollider = this.physics.add.collider(this.cultists, this.faune, this.handlePlayerEnemyCollision, undefined, this)
		this.playerBatsCollider = this.physics.add.collider(this.bats, this.faune, this.handlePlayerEnemyCollision, undefined, this)

		this.playerBeartrapsCollider = this.physics.add.collider(this.beartraps, this.faune, this.handlePlayerBearTrapsCollision, undefined, this)
		this.playerFiretrapsCollider = this.physics.add.collider(this.firetraps, this.faune, this.handlePlayerFireTrapsCollision, undefined, this)
	}

	private handleSwordEnemyCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
	{
		obj2.destroy()
	}

	private handlePlayerChestCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
		const chest = obj2 as Chest
		this.faune.setChest(chest)
	}

	private handleKnifeWallCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
		obj1.destroy()
	}

	private handleKnifeEnemyCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
		obj1.destroy()
		obj2.destroy()
		// this.lizards.remove(obj2) // removes the sprite from the group, rendering it harmless
	}


	private handlePlayerBearTrapsCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {

		obj2.visible = true
		obj2.close()
		this.beartraps.remove(obj2)
		
		const dx = this.faune.x
		const dy = this.faune.y

		const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(0)

		this.faune.handleDamage(dir)
		// damage sound
		this.sound.play('hurt-sound', {
			volume: 0.2
		})

		sceneEvents.emit('player-health-changed', this.faune.health)

		if (this.faune.health <= 0){
			const deathSound = this.sound.add('game-over', {
				volume: 2
			})
			setTimeout(() => {
				deathSound.play()
			}, 600)

		}
	}

	private handlePlayerFireTrapsCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {

		obj2.visible = true
		obj2.start()
		this.firetraps.remove(obj2)
		
		const dx = this.faune.x
		const dy = this.faune.y

		const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(0)

		this.faune.handleDamage(dir)
		// damage sound
		this.sound.play('hurt-sound', {
			volume: 0.2
		})

		sceneEvents.emit('player-health-changed', this.faune.health)

		if (this.faune.health <= 0){
			const deathSound = this.sound.add('game-over', {
				volume: 2
			})
			setTimeout(() => {
				deathSound.play()
			}, 600)

		}
	}

	private handlePlayerEnemyCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
		const enemyX = Math.floor(obj2.x)
		const enemyY = Math.floor(obj2.y)
		
		const dx = this.faune.x - enemyX
		const dy = this.faune.y - enemyY

		const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

		this.faune.handleDamage(dir)
		// damage sound
		this.sound.play('hurt-sound', {
			volume: 0.2
		})

		sceneEvents.emit('player-health-changed', this.faune.health)

		if (this.faune.health <= 0){
			const deathSound = this.sound.add('game-over', {
				volume: 2
			})
			setTimeout(() => {
				deathSound.play()
			}, 600)

			// this.playerEnemiesCollider?.destroy()
		}
	}

	update(t: number, dt: number) {
		if (this.faune) {
			this.faune.update(this.cursors)
		}
	}
}
