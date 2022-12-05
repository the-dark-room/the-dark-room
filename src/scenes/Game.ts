import Phaser from "phaser";
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
	private sword!: Phaser.Physics.Arcade.Sprite
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

	// Raycaster
  private raycasterPlugin!: PhaserRaycaster; // Not sure if this is how to add the plugin
  private raycaster;
  private ray;
  private graphics;
  private intersections;
	
<<<<<<< HEAD
	private gameTimer
	private MAXTIME = 60
	private currentTime = 0
=======
	// raycasting stuff
  light;
  renderTexture;
  cover;
  fogOfWar;
	blackRectangle;
	mapWidth;
	mapHeight;
>>>>>>> main

	constructor() {
		super('game')
	}

	preload() {
		this.cursors = this.input.keyboard.createCursorKeys()
	}

	create() {
<<<<<<< HEAD



		/*
		** Game Timer
		*/

		function updateGameTime(){
			this.currentTime += 1
			// console.log(this.currentTime)
			sceneEvents.emit('gameTimer-changed', {
				MAXTIME: this.MAXTIME,
				currentTime: this.currentTime
			})
		}

		this.gameTimer = this.time.addEvent({
			delay: 1000,
			callback: updateGameTime,
			repeat: 60,
			callbackScope: this
		})

		/*
		**
		*/



=======
		// zoom for testing walls
    // this.cameras.main.setZoom(.5)
		
>>>>>>> main
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

		this.meleeHitbox = this.add.rectangle(0, 0, 25, 20, 0xffffff, 0) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody
		this.physics.add.existing(this.meleeHitbox)
		this.meleeHitbox.body.enable = false

		this.anims.create({
			key: 'swing',
			frames: [
					// { key: 'sword1' },
					{ key: 'sword2' },
					{ key: 'sword3' },
					{ key: 'sword4' },
					// { key: 'sword5' },
					// { key: 'sword6' },
					// { key: 'sword7' },
			],
			frameRate: 8,
			repeat: 0
		});

		// @ts-ignore
		this.sword = this.add.sprite(45, 40, 'sword1').setVisible(false)
		this.sword.setScale(0.5)
		this.sword.on('animationcomplete', () => {
			this.meleeHitbox.body.enable = false
			this.sword.setVisible(false)
		})

		this.faune = this.add.faune(50, 50, 'faune')
		this.faune.setSword(this.meleeHitbox)
		// this.faune.setKnives(this.knives)

		// // smaller hitbox
		this.faune.setSize(10, 12).setOffset(12,15)
		this.faune.setDepth(1)

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


		// Raycaster
		// sets the bounding box for the rays
    const bounds = new Phaser.Geom.Rectangle(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels
    );
		// creates raycasting
    this.raycaster = this.raycasterPlugin.createRaycaster({
      boundingBox: bounds,
    });
		// creates the ray with origin being on the player
    this.ray = this.raycaster.createRay({
      origin: {
        x: this.faune.x,
        y: this.faune.y,
      },
    });

    //set ray cone size (angle)
    this.ray.setConeDeg(60);
    // cast ray in a cone
    this.intersections = this.ray.castCone();

		// lineStyle with a width of 0 ensures that the rays are invisible
    this.graphics = this.add.graphics({
      lineStyle: { width: 0, color: 0x00ff00 },
      fillStyle: { color: 0xffffff, alpha: 0.3 },
    });


		// setting some constants
		this.mapWidth = map.widthInPixels;
		this.mapHeight = map.heightInPixels;

		// creates the "mask" over the map
    this.blackRectangle = new Phaser.GameObjects.Rectangle(
      this,
      0,
      0,
      map.widthInPixels,
      map.heightInPixels,
      0,
      1
    );
		// creates the renderTexture that we can draw with
    this.fogOfWar = this.add.renderTexture(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels 
    );
		// actually draw it
    this.fogOfWar.draw(this.blackRectangle, map.widthInPixels*0.5, map.heightInPixels*0.5);
		// using the same function we made for our raycasting to draw the fogOfWar
		this.draw();


    //create obstacles for the raycasting to interact with
    let obstacles = this.add.group();
    createObstacles(this);

    //map obstacles
    this.raycaster.mapGameObjects(obstacles.getChildren());
    // this.raycaster.mapGameObjects(wallsLayer, false, {
    //   collisionTiles: [248, 244, 294],
    // });

		// creating obstacles
    function createObstacles(scene) {
			let obstacle;

      //create line obstacle
      // let obstacle = scene.add
      //   .line(400, 100, 0, 0, 200, 50)
      //   .setStrokeStyle(1, 0xff0000);
      // obstacles.add(obstacle);

      //create polygon obstacle
      // obstacle = scene.add
      //   .polygon(650, 500, [0, 0, 50, 50, 100, 0, 100, 75, 50, 100, 0, 50])
      //   .setStrokeStyle(1, 0xff0000);
      // obstacles.add(obstacle);

      //create overlapping obstacles
      // for (let i = 0; i < 5; i++) {
      //   obstacle = scene.add
      //     .rectangle(350 + 30 * i, 550 - 30 * i, 50, 50)
      //     .setStrokeStyle(1, 0xff0000);
      //   obstacles.add(obstacle, true);
      // }

      //create image obstacle
      // obstacle = scene.add.image(800, 800, "mapImage");
      // obstacles.add(obstacle, true);

      // let t = chests.getChildren();
      // t.forEach((chest) => {
      //   obstacles.add(chest, true);
      // });


      // LEFT OUTER WALL
      obstacle = scene.add
        .rectangle(8, 800, 16, 1600) // (x, y) = (tile-coords * 16) / 2
        .setStrokeStyle(1, 0xff0000); // the MIDDLE of the shape is what the (x, y) refers to, that's why
      obstacles.add(obstacle, true); // we do this weird shiz.

      // TOP OUTER WALL
      obstacle = scene.add
        .rectangle(800, 8, 1600, 16) // (x, y) = (tile-coords * 16) / 2
        .setStrokeStyle(1, 0xff0000); // the MIDDLE of the shape is what the (x, y) refers to, that's why
      obstacles.add(obstacle, true); // we do this weird shiz.

      // RIGHT OUTER WALL
      obstacle = scene.add
        .rectangle(1592, 800, 16, 1600) // (x, y) = (tile-coords * 16) / 2
        .setStrokeStyle(1, 0xff0000); // the MIDDLE of the shape is what the (x, y) refers to, that's why
      obstacles.add(obstacle, true); // we do this weird shiz.

      obstacle = scene.add
        .rectangle(800, 1592, 1600, 16) // (x, y) = (tile-coords * 16) / 2
        .setStrokeStyle(1, 0xff0000); // the MIDDLE of the shape is what the (x, y) refers to, that's why
      obstacles.add(obstacle, true);
    }


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

		// Wall collisions
		this.physics.add.collider(this.faune, wallsLayer)

		this.physics.add.collider(this.ghosts, wallsLayer)  //GHOST
		this.physics.add.collider(this.bods, wallsLayer)  //BOD
		this.physics.add.collider(this.frogs, wallsLayer)  //FROG
		this.physics.add.collider(this.skeletons, wallsLayer)  //SKELETON
		this.physics.add.collider(this.bats, wallsLayer)  //BAT
		this.physics.add.collider(this.cultists, wallsLayer)  //CULTIST
		this.physics.add.collider(this.chrisps, wallsLayer)  //CHRISP
		this.physics.add.collider(this.knives, wallsLayer, this.handleKnifeWallCollision, undefined, this) //knives

		//chest-faune collisions
		this.physics.add.collider(this.faune, chests, this.handlePlayerChestCollision, undefined, this)

		// melee-enemy collisions
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

		// This makes sure that the mouse x and y are accurate
    const crosshairX =
      this.game.input.mousePointer.x +
      this.game.input.mousePointer.camera?.worldView.x;
    const crosshairY =
      this.game.input.mousePointer.y +
      this.game.input.mousePointer.camera?.worldView.y;
    const mouseAngle = Math.atan2(
      crosshairY - this.faune.y,
      crosshairX - this.faune.x
    );

		// setting the angle for the rays
    this.ray.setAngle(mouseAngle);
    this.intersections = this.ray.castCone();
    this.draw();
	}
<<<<<<< HEAD
	
=======

	// function we call several times (no touchie)
	draw() {
    this.ray.setOrigin(this.faune.x, this.faune.y);
    this.intersections.push(this.ray.origin);
    this.graphics.clear();
    this.graphics.fillStyle(0xffffff, 0.3);
    this.graphics.fillPoints(this.intersections);

		// redraw the black fogOfWar. If we want this to be a scratch-off thing, comment out the below line
		this.fogOfWar.draw(this.blackRectangle, this.mapWidth*0.5, this.mapHeight*0.5);

    for (let intersection of this.intersections) {
			let graph = {
        x1: this.faune.x,
        y1: this.faune.y,
        x2: intersection.x,
        y2: intersection.y,
      }
      this.graphics.strokeLineShape(graph);
			// removes the blackness from the area cast by the rays
      this.fogOfWar.erase(this.graphics);
    }
  }
>>>>>>> main
}
