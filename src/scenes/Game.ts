import Phaser from "phaser";

import { debugDraw } from "../utils/debug";
import { createLizardAnims } from "../anims/EnemyAnims";
import { createCharacterAnims } from "../anims/CharacterAnims";
import { createChestAnims } from "../anims/TreasureAnims";

import Lizard from "../enemies/Lizard";

import "../characters/Faune";
import Faune from "../characters/Faune";

import { sceneEvents } from "../events/EventsCenter";
import Chest from "../items/Chest";
import Walls from "~/items/Walls";

import PhaserRaycaster from "phaser-raycaster";

// let light = null;
// let renderTexture = null;;

export default class Game extends Phaser.Scene {
  // Raycaster
  private raycasterPlugin!: PhaserRaycaster; // Not sure if this is how to add the plugin
  private raycaster;
  private ray;
  private graphics;
  private numberOfRays = 15;
  private lightAngle = Math.PI / 4;
  private rayLength = 100;
  private intersections;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Faune;

  private knives!: Phaser.Physics.Arcade.Group;
  private lizards!: Phaser.Physics.Arcade.Group;

  private playerLizardsCollider?: Phaser.Physics.Arcade.Collider;
  // test?
  light;
  renderTexture;
  cover;
  fogOfWar;

  constructor() {
    super("game");
    // this.light = null;
    // this.renderTexture = null;
    // this.cover;
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    // zoom for testing walls
    // this.cameras.main.setZoom(.5)

    this.scene.run("game-ui");

    createCharacterAnims(this.anims);
    createLizardAnims(this.anims);
    createChestAnims(this.anims);

    // adds the map and the tiles for it
    const map = this.make.tilemap({ key: "dungeon" });
    const tileset = map.addTilesetImage(
      "watabou_pixel_dungeon_spritesheet",
      "tiles"
    );

    const layer = map.createStaticLayer("background", tileset);

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 200,
    });

    this.faune = this.add.faune(128, 128, "faune");
    this.faune.setKnives(this.knives);

    const wallsLayer = map.createStaticLayer("Walls", tileset);

    wallsLayer.setCollisionByProperty({ collides: true });

    const reveal = this.add.image(0, 0, "reveal");
    this.cover = this.add.image(0, 0, "floor");
    this.cover.setTint(0x004c99);

    // // ray test --------------------
    // let polygons = [];
    // wallsLayer.forEachTile(function(t) {
    //   if(t.index == 1) {
    //     polygons.push([[t.pixelX, t.pixelY], [t.pixelX + t.width, t.pixelY], [t.pixelX + t.width, t.pixelY + t.height], [t.pixelX, t.pixelY + t.height]]);
    //   }
    // });
    // console.log(polygons);
    // polygons.push([[-1, -1], [wallsLayer.width + 1 , - 1], [wallsLayer.width + 1, wallsLayer.height + 1], [-1, wallsLayer.height + 1]]);

    // // no ray test -----------------

    //wall object layer test ------------------------

    // makes the walls just a black square for raycasting purposes
    // const objectWalls = this.physics.add.staticGroup({
    //   classType: Walls,
    // })
    // const wallObjectLayer = map.getObjectLayer("objectWalls")
    // wallObjectLayer.objects.forEach((wallObj) => {
    //   objectWalls.get(
    //     wallObj.x! + wallObj.width! * 0.5,
    //     wallObj.y! - wallObj.height! * 0.5,
    //     "blackSquare",
    //   )
    // })

    // this.raycaster.mapGameObjects(wallsLayer, false, {
    //   collisionTiles: [193]
    // })

    //stop test ---------------------------------

    const chests = this.physics.add.staticGroup({
      classType: Chest,
    });
    const chestsLayer = map.getObjectLayer("chests");
    chestsLayer.objects.forEach((chestObj) => {
      chests.get(
        chestObj.x! + chestObj.width! * 0.5,
        chestObj.y! - chestObj.height! * 0.5,
        "treasure"
      );
    });

    this.cameras.main.startFollow(this.faune, true);

    this.lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (go) => {
        const lizGo = go as Lizard;
        lizGo.body.onCollide = true;
      },
    });

    const lizardsLayer = map.getObjectLayer("Lizards");
    lizardsLayer.objects.forEach((lizObj) => {
      this.lizards.get(
        lizObj.x! + lizObj.width! * 0.5,
        lizObj.y! - lizObj.height! * 0.5,
        "lizard"
      );
    });

    // Raycaster
    const bounds = new Phaser.Geom.Rectangle(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels
    );
    this.raycaster = this.raycasterPlugin.createRaycaster({
      boundingBox: bounds,
    });
    this.ray = this.raycaster.createRay({
      origin: {
        x: this.faune.x,
        y: this.faune.y,
      },
      // rayRange: this.rayLength,
    });

    //set ray cone size (angle)
    this.ray.setConeDeg(60);
    // cast ray in a cone
    this.intersections = this.ray.castCone();

    this.graphics = this.add.graphics({
      // lineStyle: { width: 1, color: 0x00ff00 },
      fillStyle: { color: 0xffffff, alpha: 0.3 },
    });
    this.draw();

    // test floor

    // let floor = this.add.sprite(0,0, "floor")

    const blackRectangle = new Phaser.GameObjects.Rectangle(
      this,
      0,
      0,
      map.widthInPixels,
      map.heightInPixels,
      0,
      1
    );
    this.fogOfWar = this.add.renderTexture(
      -map.widthInPixels / 2,
      -map.heightInPixels / 2,
      map.widthInPixels * 2,
      map.heightInPixels * 2
    );
    this.fogOfWar.draw(blackRectangle, map.widthInPixels, map.heightInPixels);

    // Masking
    // const width = this.cover.width;
    // const height = this.cover.height;

    // const rt = this.make.renderTexture({
    //   width,
    //   height,
    //   add: false, // maybe unneeded? no idea what it does
    // });

    // const maskImage = this.make.image({
    //   x: 0,
    //   y: 0,
    //   key: rt.texture.key,
    //   add: false,
    // });

    // this.cover.mask = new Phaser.Display.Masks.BitmapMask(this, maskImage);
    // this.cover.mask.invertAlpha = true;

    // reveal.mask = new Phaser.Display.Masks.BitmapMask(this, maskImage);

    // this.light = this.add.circle(0, 0, 30, 0x000000, 1);
    // this.light.visible = false;

    // this.input.on(
    //   Phaser.Input.Events.POINTER_MOVE,
    //   this.handlePointerMove,
    //   this
    // );
    // this.renderTexture = rt;

    // BEGIN TILE-RAYCASTING TEST CODE

    // let polygons = [];
    // this.cursors = this.input.keyboard.createCursorKeys();

    // wallsLayer.forEachTile((t) => {
    //   if(t.index == 1){
    //   polygons.push([[t.pixelX, t.pixelY], [t.pixelX + t.width, t.pixelY], [t.pixelX + t.width, t.pixelY + t.height], [t.pixelX, t.pixelY + t.height]]);
    //   }
    // })
    // console.log(polygons);
    // polygons.push([[-1, -1], [wallsLayer.width + 1 , - 1], [wallsLayer.width + 1, wallsLayer.height + 1], [-1, wallsLayer.height + 1]]);
    // console.log(polygons);

    // let wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    //       wKey.on("down", function(){
    //           wallGraphics.setVisible(true);
    //       }, this);
    //       wKey.on("up", function(){
    //           wallGraphics.setVisible(false);
    //       }, this);
    //   let wallGraphics = this.add.graphics();
    //       wallGraphics.setVisible(false);
    //   wallGraphics.lineStyle(1, 0x00ff00);
    //   polygons.forEach(function(p){
    //     wallGraphics.strokeRect(p[0][0], p[0][1], p[2][0] - p[0][0],  p[2][1] - p[0][1]);
    // });

    // this.group = this.add.group()
    // this.raycaster.mapGameObjects(this.group.getChildren())
    // this.raycaster.mapGameObjects(wallsLayer, false, {
    //   collisionTiles: [244, 248, 294, 193]
    // })

    //create obstacles
    let obstacles = this.add.group();
    createObstacles(this, this.lizards);

    //map obstacles
    this.raycaster.mapGameObjects(obstacles.getChildren());
    // this.raycaster.mapGameObjects(this.lizards.getChildren())
    this.raycaster.mapGameObjects(wallsLayer, false, {
      collisionTiles: [248, 244, 294],
    });
    // this.raycaster.mapGameObjects(chests)

    // let lizardBois = this.lizards;
    // console.log(lizardBois);

    // obstacles.add(chests, true)

    function createObstacles(scene, lizards) {
      //create rectangle obstacle
      // let obstacle = scene.add
      //   .rectangle(100, 100, 75, 75)
      //   .setStrokeStyle(1, 0xff0000);
      // obstacles.add(obstacle, true);

      //create line obstacle
      let obstacle = scene.add
        .line(400, 100, 0, 0, 200, 50)
        .setStrokeStyle(1, 0xff0000);
      obstacles.add(obstacle);

      //create circle obstacle
      obstacle = scene.add.circle(650, 100, 50).setStrokeStyle(1, 0xff0000);
      obstacles.add(obstacle);

      //create polygon obstacle
      obstacle = scene.add
        .polygon(650, 500, [0, 0, 50, 50, 100, 0, 100, 75, 50, 100, 0, 50])
        .setStrokeStyle(1, 0xff0000);
      obstacles.add(obstacle);

      //create overlapping obstacles
      for (let i = 0; i < 5; i++) {
        obstacle = scene.add
          .rectangle(350 + 30 * i, 550 - 30 * i, 50, 50)
          .setStrokeStyle(1, 0xff0000);
        obstacles.add(obstacle, true);
      }

      //create image obstacle
      // obstacle = scene.add.image(800, 800, "mapImage");
      // obstacles.add(obstacle, true);

      let t = chests.getChildren();
      t.forEach((chest) => {
        obstacles.add(chest, true);
      });

      // walls
      // let wallObjects = objectWalls.getChildren();
      // wallObjects.forEach((wall) => {
      //   obstacles.add(wall, true)
      // })

      // obstacle = scene.add.image(80, 500, "mapImage")
      // obstacles.add(obstacle, true)

      // let me try adding polygons for the rays to interact with...

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

    // END TEST CODE

    this.physics.add.collider(this.faune, wallsLayer);
    this.physics.add.collider(this.lizards, wallsLayer);

    this.physics.add.collider(
      this.faune,
      chests,
      this.handlePlayerChestCollision,
      undefined,
      this
    );

    this.physics.add.collider(
      this.knives,
      wallsLayer,
      this.handleKnifeWallCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.knives,
      this.lizards,
      this.handleKnifeLizardCollision,
      undefined,
      this
    );

    this.playerLizardsCollider = this.physics.add.collider(
      this.lizards,
      this.faune,
      this.handlePlayerLizardCollision,
      undefined,
      this
    );
  }

  // test shit
  handlePointerMove(pointer) {
    const x = pointer.x - this.cover.x + this.cover.width * 0.5;
    const y = pointer.y - this.cover.y + this.cover.height * 0.5;

    this.renderTexture.clear();
    this.renderTexture.draw(this.light, x, y);
  }

  private handlePlayerChestCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const chest = obj2 as Chest;
    this.faune.setChest(chest);
  }

  private handleKnifeWallCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    this.knives.killAndHide(obj1);
  }

  private handleKnifeLizardCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    this.knives.killAndHide(obj1);
    this.lizards.killAndHide(obj2);
  }

  private handlePlayerLizardCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const lizard = obj2 as Lizard;

    const dx = this.faune.x - lizard.x;
    const dy = this.faune.y - lizard.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.faune.handleDamage(dir);

    sceneEvents.emit("player-health-changed", this.faune.health);

    if (this.faune.health <= 0) {
      this.playerLizardsCollider?.destroy();
    }
  }

  update(t: number, dt: number) {
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

    this.ray.setAngle(mouseAngle);
    // this.ray.setAngle(this.ray.angle + 0.01);
    this.intersections = this.ray.castCone();
    this.draw();

    // this.handlePointerMove(crosshairX, crosshairY)
  }

  draw() {
    // this.intersections.push({
    //   origin: {
    //     x: this.faune.x,
    //     y: this.faune.y,
    //   },
    // });
    // const eraser = new Phaser.GameObjects.Rectangle(this, 0, 0, 200, 200, 0, 1);
    // this.fogOfWar.erase(
    //   eraser,
    //   this.faune.body.x + 1600 / 2,
    //   this.faune.body.y + 1600 / 2
    // );
    // eraser.destroy();
    this.ray.setOrigin(this.faune.x, this.faune.y);
    this.intersections.push(this.ray.origin);
    // this.renderTexture.clear();
    // this.renderTexture.draw(this.light, x, y);
    this.graphics.clear();
    this.graphics.fillStyle(0xffffff, 0.3);
    // this.graphics.fillStyle(this.light, 0.3);
    this.graphics.fillPoints(this.intersections);

    for (let intersection of this.intersections) {
      this.graphics.strokeLineShape({
        x1: this.faune.x,
        y1: this.faune.y,
        x2: intersection.x,
        y2: intersection.y,
      });
      this.fogOfWar.erase(this.graphics);
    }
  }
}
