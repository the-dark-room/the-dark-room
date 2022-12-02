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

import PhaserRaycaster from "phaser-raycaster";

export default class Game extends Phaser.Scene {
  // Raycaster
  private raycasterPlugin!: PhaserRaycaster; // Not sure if this is how to add the plugin
  private raycaster;
  private ray;
  private graphics;
  private rayLength = 100;
  private intersections;
  private container;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Faune;

  private knives!: Phaser.Physics.Arcade.Group;
  private lizards!: Phaser.Physics.Arcade.Group;

  private playerLizardsCollider?: Phaser.Physics.Arcade.Collider;

  constructor() {
    super("game");
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
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

    map.createStaticLayer("background", tileset);

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 200,
    });

    this.faune = this.add.faune(128, 128, "faune");
    this.faune.setKnives(this.knives);

    const wallsLayer = map.createStaticLayer("Walls", tileset);

    wallsLayer.setCollisionByProperty({ collides: true });

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

    this.container = this.add.container(map.widthInPixels, map.heightInPixels);

    const lizardsLayer = map.getObjectLayer("Lizards");
    lizardsLayer.objects.forEach((lizObj) => {
      this.lizards.get(
        lizObj.x! + lizObj.width! * 0.5,
        lizObj.y! - lizObj.height! * 0.5,
        "lizard"
      );
    });

    // this.lizards.forEach((lizard) => this.container.add(lizard));
    // this.lizards.children.entries.forEach((lizard) =>
    //   this.container.add(lizard)
    // );
    console.log(this.lizards.children.entries);
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

    this.raycaster.mapGameObjects(this.lizards.children.entries);
    // This one causes an error
    // this.raycaster.mapGameObjects(this.map, false, {
    //   collisionTiles: [wallsLayer],
    // });
    // this.ray.autoSlice = true;
    this.ray.autoSlice = true;
    //enable arcade physics body
    this.ray.enablePhysics();
    //set collision (field of view) range
    // this.ray.setCollisionRange(this.rayLength);

    //set ray cone size (angle)
    this.ray.setConeDeg(60);
    // cast ray in a cone
    this.intersections = this.ray.castCone();

    let visibleObjects = this.ray.overlap();
    visibleObjects = this.ray.overlap(this.lizards);

    this.graphics = this.add.graphics({
      lineStyle: { width: 1, color: 0x00ff00 },
      fillStyle: { color: 0xffffff, alpha: 0.3 },
    });
    this.draw();

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

    const mouseAngle = Math.atan2(
      this.game.input.mousePointer.worldY - this.faune.y,
      this.game.input.mousePointer.worldX - this.faune.x
    );
    // console.log(this.game.input.mousePointer.worldX);
    // console.log("AAAAAAAAAAAAAAAAAAAAAAAAA", this.faune.x, this.faune.y);
    this.ray.setAngle(mouseAngle);
    // this.ray.setAngle(this.ray.angle + 0.01);
    this.intersections = this.ray.castCone();
    this.draw();
  }

  draw() {
    // this.intersections.push({
    //   origin: {
    //     x: this.faune.x,
    //     y: this.faune.y,
    //   },
    // });
    this.ray.setOrigin(this.faune.x, this.faune.y);
    this.intersections.push(this.ray.origin);

    this.graphics.clear();
    this.graphics.fillStyle(0xffffff, 0.3);
    this.graphics.fillPoints(this.intersections);

    for (let intersection of this.intersections) {
      this.graphics.strokeLineShape({
        x1: this.faune.x,
        y1: this.faune.y,
        x2: intersection.x,
        y2: intersection.y,
      });
    }
  }
}
