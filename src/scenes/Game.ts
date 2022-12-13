import Phaser from "phaser";
import { debugDraw } from "../utils/debug";

import { loadAllAnims } from "../anims";

import Ghost from "../enemies/Ghost"; //GHOST
import Bod from "../enemies/Bod"; //BOD
import Frog from "../enemies/Frog"; //FROG
import Skeleton from "../enemies/Skeleton"; //SKELETON
import Bat from "../enemies/Bat"; //BAT
import Cultist from "../enemies/Cultist"; //CULTIST
import Chrisp from "../enemies/Chrisp"; //CHRISP
import BearTrap from "../traps/BearTrap"; //BEAR TRAP
import FireTrap from "../traps/FireTrap"; //FIRE TRAP

import "../characters/Faune";
import Faune from "../characters/Faune";

import { sceneEvents } from "../events/EventsCenter";
import Chest from "../items/Chest";


let map;
let mapCount = 0;
let mapArr = [
  "map_jail",
  "map_hallway",
  "map_maze",
  "map_cultists",
  "map_bigEmpty",
];

// timer
let currentTime = 0;

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Faune;

  private sword!: Phaser.Physics.Arcade.Sprite;
  private knives!: Phaser.Physics.Arcade.Group;
  private meleeHitbox!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  // private chrispSwingBox: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  private ghosts!: Phaser.Physics.Arcade.Group; //GHOST
  private bods!: Phaser.Physics.Arcade.Group; //BOD
  private frogs!: Phaser.Physics.Arcade.Group; //FROG
  private skeletons!: Phaser.Physics.Arcade.Group; //SKELETON
  private bats!: Phaser.Physics.Arcade.Group; //BAT
  private cultists!: Phaser.Physics.Arcade.Group; //CULTIST
  private chrisps!: Phaser.Physics.Arcade.Group; //CHRISP
  private beartraps!: Phaser.Physics.Arcade.StaticGroup; //BEAR TRAP
  private firetraps!: Phaser.Physics.Arcade.StaticGroup; //FIRE TRAP

  private ghostTrackTimer; //TIMER TO UPDATE GHOST CHASING PLAYER
  private chrispTrackTimer;//TIMER TO UPDATE CHRISP CHASING PLAYER
  private GHOSTSPEED = 25; //HOW MANY PIXELS PER SECOND THE GHOST MOVES
  private GHOSTSTUN = 2000; //HOW OFTEN THE GHOST UPDATES ITS DIRECTION / ALSO IS STUN DURATION
  private CHRISPEED = 40  //HOW MANY PIXELS PER SECOND THE CHRISPS MOVES

  private playerGhostsCollider?: Phaser.Physics.Arcade.Collider;
  private playerBodsCollider?: Phaser.Physics.Arcade.Collider;
  private playerFrogsCollider?: Phaser.Physics.Arcade.Collider;
  private playerSkeletonsCollider?: Phaser.Physics.Arcade.Collider;
  private playerBatsCollider?: Phaser.Physics.Arcade.Collider;
  private playerCultistsCollider?: Phaser.Physics.Arcade.Collider;
  private playerChrispsCollider?: Phaser.Physics.Arcade.Collider;
  private playerBeartrapsCollider?: Phaser.Physics.Arcade.Collider;
  private playerFiretrapsCollider?: Phaser.Physics.Arcade.Collider;

  // Raycaster
  private raycasterPlugin!: PhaserRaycaster; // Not sure if this is how to add the plugin
  private raycaster;
  private ray;
  private graphics;
  private intersections;

  // raycasting stuff
  light;
  renderTexture;
  cover;
  fogOfWar;
  blackRectangle;
  mapWidth;
  mapHeight;

  /*
   ** GAME TIMER
   */
  private gameTimer;
  private MAXTIME = 600; //IN SECONDS
  private keyQ;
  /*
   ** GAME TIMER
   */

  constructor() {
    super("game");
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    /*
     ** GAME TIMER
     */
    function updateGameTime() {
      currentTime += 1;
      // console.log(this.currentTime)
      sceneEvents.emit("gameTimer-changed", {
        MAXTIME: this.MAXTIME,
        currentTime: currentTime,
      });
      if (currentTime >= this.MAXTIME) {
        this.scene.start("loser", { currentTime: currentTime }); //LOSER
      }
    }

    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: updateGameTime,
      // repeat: 60,
      loop: true,
      callbackScope: this,
    });

    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    /*
     ** GAME TIMER
     */

    // zoom for testing walls
    // this.cameras.main.setZoom(.2)

    // main music
    const thrillerMusic = this.sound.add("thriller-music", {
      loop: true,
      volume: 0.2,
    });
    thrillerMusic.play();

    this.scene.run("game-ui");

    loadAllAnims(this.anims);

    // adds the map and the tiles for it
    // we need it like this so we can optionally take in a new map when we change maps
    map = map || this.make.tilemap({ key: "map_jail" });
    const tileset = map.addTilesetImage(
      "watabou_pixel_dungeon_spritesheet",
      "tiles"
    );

    map.createLayer("background", tileset);

    // @ts-ignore

    //faune setup
    this.faune = this.add.faune(50, 50, "faune");
    this.faune.setSize(10, 12).setOffset(12, 15);
    this.faune.setDepth(1);

    //wall setup
    const wallsLayer = map.createLayer("Walls", tileset);

    // so we can replay the game
    if(!wallsLayer) {
      currentTime = 0;
      map.destroy(); // destroy the current map
      map = this.make.tilemap({ key: mapArr[0] }); // add a new one

      // restart the scene, including the new map as a parameter so we can carry it over
      this.scene.restart(map);
      return
    }

    wallsLayer.setCollisionByProperty({ collides: true });

    const chests = this.physics.add.staticGroup({
      classType: Chest,
    });
    const chestsLayer = map.getObjectLayer("chests");
    let loreArr = []

    chestsLayer.objects.forEach((chestObj) => {
      chests.get(
        chestObj.x! + chestObj.width! * 0.5,
        chestObj.y! - chestObj.height! * 0.5,
        "treasure",
      );
      loreArr.push(chestObj.properties[0].value)
    });
    // chests.children.entries[0].lore = 'maybe?'
    // chests.children.entries[1].lore = '???????'

    for(let i=0; i < chests.children.entries.length; i++) {
      chests.children.entries[i].lore = loreArr[i]
    }

    // camera follows the player
    this.cameras.main.startFollow(this.faune, true);

    // get the polygon(s) for the walls
    const shape = map.getObjectLayer("raycast");
    let shapeArr = [];
    shape.objects.forEach((shapeObj) => {
      shapeArr.push(shapeObj);
    });
    // console.log(shapeArr[0]);

    let please = [];
    for (let i = 0; i < shapeArr[0].polygon.length; i++) {
      please.push(shapeArr[0].polygon[i].x, shapeArr[0].polygon[i].y);
    }

    // up stairs
    const stairUp = map.getObjectLayer("stairUp");
    const stairUpGroup = this.physics.add.staticGroup();
    stairUp.objects.forEach((stairObj) => {
      stairUpGroup.get(
        stairObj.x! + stairObj.width! * 0.5,
        stairObj.y! - stairObj.height! * 0.5,
        "stair-down"
      );
    });
    // assigning names for map switching purposes
    stairUpGroup.name = stairUp.objects[0].name;

    // down stairs
    const stairDown = map.getObjectLayer("stairDown");
    const stairDownGroup = this.physics.add.staticGroup();
    stairDown.objects.forEach((stairObj) => {
      stairDownGroup.get(
        stairObj.x! + stairObj.width! * 0.5,
        stairObj.y! - stairObj.height! * 0.5,
        "stair-down"
      );
    });

    // exit door/staircase
    const exitDoor = map.getObjectLayer("exit");
    const exitDoorGroup = this.physics.add.staticGroup();

    if(exitDoor){
      exitDoor.objects.forEach((exitObj) => {
        exitDoorGroup.get(
          exitObj.x! + exitObj.width! * 0.5,
          exitObj.y! - exitObj.height! * 0.5,
          "stair-down"
        );
      });
  }

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
      // detectionRange: 10,
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
    this.fogOfWar.draw(
      this.blackRectangle,
      map.widthInPixels * 0.5,
      map.heightInPixels * 0.5
    );
    this.fogOfWar.setDepth(10);
    // using the same function we made for our raycasting to draw the fogOfWar
    this.draw();

    //create obstacles for the raycasting to interact with
    let obstacles = this.add.group();
    createObstacles(this);

    //map obstacles
    this.raycaster.mapGameObjects(obstacles.getChildren());

    // creating obstacles
    function createObstacles(scene) {
      let obstacle;

      //create image obstacle
      // obstacle = scene.add.image(800, 800, "mapImage");
      // obstacles.add(obstacle, true);

      // let t = chests.getChildren();
      // t.forEach((chest) => {
      //   obstacles.add(chest, true);
      // });

      // shapeArr.forEach((s) => {
      // 	console.log(s);
      // 	obstacles.add(s, true)
      // })

      // draw in the polygon for the raycasting to interact with
      obstacle = scene.add
        .polygon(map.widthInPixels / 2, map.heightInPixels / 2, please)
        .setStrokeStyle(0, 0xff0000);
      // .setDepth(99)
      obstacles.add(obstacle);
    }

    /*
     ** ENEMY PHYSICS GROUPS
     */
    this.ghosts = this.physics.add.group({
      //GHOST
      classType: Ghost,
    });
    this.bods = this.physics.add.group({
      //BOD
      classType: Bod,
    });
    this.frogs = this.physics.add.group({
      //FROG
      classType: Frog,
    });
    this.skeletons = this.physics.add.group({
      //SKELETONS
      classType: Skeleton,
    });
    this.bats = this.physics.add.group({
      //BAT
      classType: Bat,
    });
    this.cultists = this.physics.add.group({
      //CULTIST
      classType: Cultist,
    });
    this.chrisps = this.physics.add.group({
      //CHRISP
      classType: Chrisp,
    });
    this.beartraps = this.physics.add.staticGroup({
      //BEAR TRAP
      classType: BearTrap,
    });
    this.firetraps = this.physics.add.staticGroup({
      //FIRE TRAP
      classType: FireTrap,
    });

    /*
     ** LOAD ENEMIES INTO SCENE - uncomment when each map layer is complete
     */

    const ghostsLayer = map.getObjectLayer("ghosts");
    ghostsLayer.objects.forEach((e) => {
      this.ghosts
        .get(e.x! + e.width! * 0.5, e.y! - e.height! * 0.5, "ghost")
        .setScale(0.8);
    });

    const bodsLayer = map.getObjectLayer("bods");
    bodsLayer.objects.forEach((e) => {
      this.bods
        .get(e.x! + e.width! * 0.5, e.y! - e.height! * 0.5, "bod")
        .setScale(0.5);
    });

    const frogsLayer = map.getObjectLayer("frogs");
    frogsLayer.objects.forEach((e) => {
      this.frogs.get(e.x! + e.width! * 0.5, e.y! - e.height! * 0.5, "frog");
    });

    const skeletonsLayer = map.getObjectLayer("skeleton");
    skeletonsLayer.objects.forEach((e) => {
      this.skeletons.get(
        e.x! + e.width! * 0.5,
        e.y! - e.height! * 0.5,
        "skeleton"
      );
    });

    const batsLayer = map.getObjectLayer("bats");
    batsLayer.objects.forEach((e) => {
      this.bats.get(e.x! + e.width! * 0.5, e.y! - e.height! * 0.5, "bat");
    });

    const cultistsLayer = map.getObjectLayer("cultists");
    cultistsLayer.objects.forEach((e) => {
      this.cultists
        .get(e.x! + e.width! * 0.5, e.y! - e.height! * 0.5, "cultist")
        .setScale(0.6);
    });

    const chrispsLayer = map.getObjectLayer("chrisps");
    if(chrispsLayer) {
      chrispsLayer.objects.forEach((e) => {
        this.chrisps.get(e.x! + e.width! * 0.5, e.y! - e.height! * 0.5, "chrisp")
        .setScale(3)
        .setSize(20, 30);
      });
    }

    const beartrapsLayer = map.getObjectLayer("beartraps");
    beartrapsLayer.objects.forEach((e) => {
      this.beartraps.get(
        e.x! + e.width! * 0.5,
        e.y! - e.height! * 0.5,
        "beartrap"
      ).visible = false;
    });

    const firetrapsLayer = map.getObjectLayer("firetraps");
    firetrapsLayer.objects.forEach((e) => {
      this.firetraps.get(
        e.x! + e.width! * 0.5,
        e.y! - e.height! * 0.5,
        "firetrap"
      ).visible = false;
    });

    /*
     ** GHOST CHASING PLAYER
     */
    this.ghostTrackTimer = this.time.addEvent({
      delay: this.GHOSTSTUN,
      callback: ghostTracker,
      loop: true,
      callbackScope: this,
    });

    function ghostTracker() {
      this.ghosts.children.entries.forEach((e) => {
      this.physics.moveToObject(e, this.faune, this.GHOSTSPEED);
      });
    }
    /*
    ** GHOST CHASING PLAYER
    */

    /*
     ** CHRISP CHASING PLAYER
     */
    this.chrispTrackTimer = this.time.addEvent({
      delay: this.GHOSTSTUN,
      callback: chrispTracker,
      loop: true,
      callbackScope: this,
    });

    function chrispTracker() {
      this.chrisps.children.entries.forEach((e) => {
      this.physics.moveToObject(e, this.faune, this.CHRISPEED);

      // if (Math.abs( e.x - this.faune.x ) <= 20 || Math.abs( e.y - this.faune.y ) <= 20){ e.swing() }
      })
    }
    /*
     ** CHRISP CHASING PLAYER
     */

    // Wall collisions
    this.physics.add.collider(this.faune, wallsLayer);

    // this.physics.add.collider(this.ghosts, wallsLayer)  //GHOST
    this.physics.add.collider(this.bods, wallsLayer); //BOD
    this.physics.add.collider(this.frogs, wallsLayer); //FROG
    this.physics.add.collider(this.skeletons, wallsLayer); //SKELETON
    this.physics.add.collider(this.bats, wallsLayer); //BAT
    this.physics.add.collider(this.cultists, wallsLayer); //CULTIST
    this.physics.add.collider(this.chrisps, wallsLayer); //CHRISP
    this.physics.add.collider(
      this.knives,
      wallsLayer,
      this.handleKnifeWallCollision,
      undefined,
      this
    ); //knives

    //chest-faune collisions
    this.physics.add.collider(
      this.faune,
      chests,
      this.handlePlayerChestCollision,
      undefined,
      this
    );
    //stairs
    this.physics.add.collider(
      this.faune,
      stairUpGroup,
      this.handleStairsUpCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.faune,
      stairDownGroup,
      this.handleStairsDownCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.faune,
      exitDoorGroup,
      this.handleExitCollision,
      undefined,
      this
    );

    // melee-enemy collisions
    this.physics.add.overlap(
      this.meleeHitbox,
      this.ghosts,
      this.handleSwordGhostCollision,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.meleeHitbox,
      this.bods,
      this.handleSwordEnemyCollision,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.meleeHitbox,
      this.frogs,
      this.handleSwordEnemyCollision,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.meleeHitbox,
      this.skeletons,
      this.handleSwordEnemyCollision,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.meleeHitbox,
      this.chrisps,
      this.handleWeaponChrispCollision,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.meleeHitbox,
      this.cultists,
      this.handleSwordEnemyCollision,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.meleeHitbox,
      this.bats,
      this.handleSwordEnemyCollision,
      undefined,
      this
    );

    // knife-enemy collisions
    this.physics.add.collider(
      this.knives,
      this.ghosts,
      this.handleKnifeGhostCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.knives,
      this.bods,
      this.handleKnifeEnemyCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.knives,
      this.frogs,
      this.handleKnifeEnemyCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.knives,
      this.skeletons,
      this.handleKnifeEnemyCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.knives,
      this.chrisps,
      this.handleWeaponChrispCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.knives,
      this.cultists,
      this.handleKnifeEnemyCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.knives,
      this.bats,
      this.handleKnifeEnemyCollision,
      undefined,
      this
    );

    this.physics.add.collider(
      this.knives,
      this.beartraps,
      this.handleKnifeBearTrapsCollision,
      undefined,
      this
    );

    this.physics.add.collider(
      this.knives,
      this.firetraps,
      this.handleKnifeFireTrapsCollision,
      undefined,
      this
    );

    this.playerGhostsCollider = this.physics.add.collider(
      this.ghosts,
      this.faune,
      this.handlePlayerEnemyCollision,
      undefined,
      this
    );
    this.playerBodsCollider = this.physics.add.collider(
      this.bods,
      this.faune,
      this.handlePlayerEnemyCollision,
      undefined,
      this
    );
    this.playerFrogsCollider = this.physics.add.collider(
      this.frogs,
      this.faune,
      this.handlePlayerEnemyCollision,
      undefined,
      this
    );
    this.playerSkeletonsCollider = this.physics.add.collider(
      this.skeletons,
      this.faune,
      this.handlePlayerEnemyCollision,
      undefined,
      this
    );
    this.playerChrispsCollider = this.physics.add.collider(
      this.chrisps,
      this.faune,
      this.handlePlayerEnemyCollision,
      undefined,
      this
    );
    // this.chrispswingboxPlayerCollider = this.physics.add.collider(
    //   this.chrispSwingBox,
    //   this.faune,
    //   this.handlePlayerEnemyCollision,
    //   undefined,
    //   this
    // );
    this.playerCultistsCollider = this.physics.add.collider(
      this.cultists,
      this.faune,
      this.handlePlayerEnemyCollision,
      undefined,
      this
    );
    this.playerBatsCollider = this.physics.add.collider(
      this.bats,
      this.faune,
      this.handlePlayerEnemyCollision,
      undefined,
      this
    );

    this.playerBeartrapsCollider = this.physics.add.collider(
      this.beartraps,
      this.faune,
      this.handlePlayerBearTrapsCollision,
      undefined,
      this
    );
    this.playerFiretrapsCollider = this.physics.add.collider(
      this.firetraps,
      this.faune,
      this.handlePlayerFireTrapsCollision,
      undefined,
      this
    );
  }

  private handleSwordEnemyCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    obj2.destroy();
  }

  private handlePlayerChestCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    obj2.setInteractive()
    const objScene = this.scene
    obj2.on('pointerdown', function () {
      console.log(obj2.lore);
      objScene.pause()
      objScene.launch('lore', {text: obj2.lore})
      obj2.removeInteractive()
    })

    // this.input.on('pointerdown', function (pointer) {
    //   console.log('in pointerdown');
		// 	if (pointer.leftButtonDown()){
    //     this.scene.pause()
    //     this.scene.launch('lore', {text: `Eat my socks`})
    //   }
    // }, this)


  }

  private handleKnifeWallCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    obj1.destroy();
  }

  private handleKnifeEnemyCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    obj1.destroy();
    obj2.destroy();
    // this.lizards.remove(obj2) // removes the sprite from the group, rendering it harmless
  }

  private handleWeaponChrispCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    if (obj1 === this.meleeHitbox) {

      // MOVE FAUNE WHEN HITTING CRISP // TODO
      // const enemyX = Math.floor(obj2.x);
      // const enemyY = Math.floor(obj2.y);

      // const dx = this.faune.x - enemyX;
      // const dy = this.faune.y - enemyY;

      // const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
      // this.faune.setVelocity(dir)
      obj2.gotHit();
    } else { // PUSH CHRISP WHEN HIT WITH KNIFE
      obj2.body.velocity =
        obj1.body.velocity ||
        new Phaser.Math.Vector2(0, 0).normalize().scale(100);
      obj1.destroy();
    }
  }

  // PUSH GHOST WHEN HIT WITH KNIFE
  private handleKnifeGhostCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    obj2.body.velocity =
      obj1.body.velocity ||
      new Phaser.Math.Vector2(0, 0).normalize().scale(400);
    obj1.destroy();
  }

  // PAUSE GHOST WHEN HIT WITH SWORD
  private handleSwordGhostCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    obj2.body.velocity = new Phaser.Math.Vector2(0, 0);
  }

  // DISABLE TRAPS WITH KNIFE THROW
  private handleKnifeBearTrapsCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    obj2.visible = true;
    obj2.destroy();
    this.beartraps.remove(obj2);
  }

  private handleKnifeFireTrapsCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    obj2.visible = true;
    obj2.destroy();
    this.beartraps.remove(obj2);
  }

  // TRAPS ARE INVISIBLE UNTIL STEPPED ON
  private handlePlayerBearTrapsCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    obj2.visible = true;
    obj2.close();
    this.beartraps.remove(obj2);

    const dx = this.faune.x;
    const dy = this.faune.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(0);

    this.faune.handleDamage(dir);
    // damage sound
    this.sound.play("hurt-sound", {
      volume: 0.2,
    });

    sceneEvents.emit("player-health-changed", this.faune.health);

    if (this.faune.health <= 0) {
      const deathSound = this.sound.add("game-over", {
        volume: 2,
      });
      setTimeout(() => {
        deathSound.play();
        this.scene.start("loser", { currentTime: currentTime }); //LOSER
      }, 600);
    }
  }

  // TRAPS ARE INVISIBLE UNTIL STEPPED ON
  private handlePlayerFireTrapsCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    obj2.visible = true;
    obj2.start();
    this.firetraps.remove(obj2);

    const dx = this.faune.x;
    const dy = this.faune.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(0);

    this.faune.handleDamage(dir);
    // damage sound
    this.sound.play("hurt-sound", {
      volume: 0.2,
    });

    sceneEvents.emit("player-health-changed", this.faune.health);

    if (this.faune.health <= 0) {
      const deathSound = this.sound.add("game-over", {
        volume: 2,
      });
      setTimeout(() => {
        deathSound.play();
        this.scene.start("loser", { currentTime: currentTime }); //LOSER
      }, 600);
    }
  }

  private handlePlayerEnemyCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    if (this.faune.health <= 0) { return }

    const enemyX = Math.floor(obj2.x);
    const enemyY = Math.floor(obj2.y);

    const dx = this.faune.x - enemyX;
    const dy = this.faune.y - enemyY;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.faune.handleDamage(dir);
    // damage sound
    this.sound.play("hurt-sound", {
      volume: 0.2,
    });

    sceneEvents.emit("player-health-changed", this.faune.health);

    if (this.faune.health <= 0) {
      const deathSound = this.sound.add("game-over", {
        volume: 2,
      });
      setTimeout(() => {
        deathSound.play();
        this.scene.start("loser", { currentTime: currentTime }); //LOSER
      }, 600);

      // this.playerEnemiesCollider?.destroy()
    }
  }

  // for the stairs / map-scene transition
  private handleStairsDownCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    mapCount--; // increment the map counter

    // ensures we don't destroy the current map if there's not another one to call
    if (mapCount < 0) {
      // reset the map counter incase this gets called (we need this because we're incrementing it outside of this )
      mapCount = 0;
      return;
    } else {
      map.destroy(); // destroy the current map
      map = this.make.tilemap({ key: mapArr[mapCount] }); // add a new one

      // restart the scene, including the new map as a parameter so we can carry it over
      this.scene.restart(map);
    }
  }

  private handleStairsUpCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    mapCount++; // increment the map counter

    // ensures we don't destroy the current map if there's not another one to call
    if (mapCount > mapArr.length - 1) {
      // reset the map counter incase this gets called (we need this because we're incrementing it outside of this )
      mapCount = mapArr.length - 1;
      return;
    } else {
      map.destroy(); // destroy the current map
      map = this.make.tilemap({ key: mapArr[mapCount] }); // add a new one

      // restart the scene, including the new map as a parameter so we can carry it over
      this.scene.restart(map);
    }
  }

  private handleExitCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {

    this.scene.stop("game-ui");
    this.scene.start("winner", { currentTime: currentTime }); //WINNER
  }

  update(t: number, dt: number) {
    if (this.keyQ.isDown) {
      this.scene.stop("game-ui");
      this.scene.start("winner", { currentTime: currentTime }); //WINNER
    }

    if (this.faune) {
      this.faune.update(this.cursors);
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

  // function we call several times (no touchie)
  draw() {
    this.ray.setOrigin(this.faune.x, this.faune.y);
    this.intersections.push(this.ray.origin);
    this.graphics.clear();
    this.graphics.fillStyle(0xffffff, 0.3);
    this.graphics.fillPoints(this.intersections);

    // redraw the black fogOfWar. If we want this to be a scratch-off thing, comment out the below line
    this.fogOfWar.draw(
      this.blackRectangle,
      this.mapWidth * 0.5,
      this.mapHeight * 0.5
    );
    const player_reveal = new Phaser.GameObjects.Ellipse(
      this,
      this.faune.x,
      this.faune.y,
      this.faune.width + 4,
      this.faune.height + 4,
      0,
      1
    );

    for (let intersection of this.intersections) {
      let graph = {
        x1: this.faune.x,
        y1: this.faune.y,
        x2: intersection.x,
        y2: intersection.y,
      };
      this.graphics.strokeLineShape(graph);
      // removes the blackness from the area cast by the rays
      this.fogOfWar.erase(this.graphics);
    }
    this.fogOfWar.erase(player_reveal);
    player_reveal.destroy();
  }
}
