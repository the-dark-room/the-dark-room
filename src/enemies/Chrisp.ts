import Phaser from 'phaser'

// enum Direction
// {
// 	UP,
// 	DOWN,
// 	LEFT,
// 	RIGHT
// }

// const randomDirection = (exclude: Direction) => {
// 	let newDirection = Phaser.Math.Between(0, 3)
// 	while (newDirection === exclude)
// 	{
// 		newDirection = Phaser.Math.Between(0, 3)
// 	}

// 	return newDirection
// }

export default class Chrisp extends Phaser.Physics.Arcade.Sprite
{
	// private direction = Direction.RIGHT
	// private moveEvent: Phaser.Time.TimerEvent

	private health = 200

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
	{
		super(scene, x, y, texture, frame)

		// this.scene.chrispSwingBox = this.scene.add.rectangle(0, 0, 40, 70, 0xffffff, 0) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody
		// this.scene.physics.add.existing(this.scene.chrispSwingBox)
		// this.scene.chrispSwingBox.body.enable = false

		this.anims.play('chrisp-walk')

		// scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this)

		// this.moveEvent = scene.time.addEvent({
		// 	delay: Phaser.Math.Between(10000,12000),
		// 	callback: () => {
		// 		this.direction = randomDirection(this.direction)
		// 	},
		// 	loop: true
		// })
	}

	gotHit() {
    this.health--
	// this.anims.play('chrisp-damage')
    if (this.health <= 0) { this.destroy() }
  }


  swing() {
		console.log('Chrisp swung')

		this.setSize(50,50)
		// this.scene.chrispSwingBox.body.enable = true

		// this.scene.chrispSwingBox!.y = this.y
		// this.scene.chrispSwingBox!.x = this.x

		// this.anims.play('chrisp-swing')
  }


  getHealth() {
    return this.health
  }

	destroy(fromScene?: boolean)
	{
		// this.anims.play('chrisp-death')

		// this.moveEvent.destroy()

		super.destroy(fromScene)
	}

	// private handleTileCollision(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile)
	// {
	// 	if (go !== this)
	// 	{
	// 		return
	// 	}

	// 	this.direction = randomDirection(this.direction)
	// }

	// preUpdate(t: number, dt: number)
	// {
	// 	super.preUpdate(t, dt)

	// 	const speed = 10

	// 	switch (this.direction)
	// 	{
	// 		case Direction.UP:
	// 			this.setVelocity(0, -speed)
	// 			break

	// 		case Direction.DOWN:
	// 			this.setVelocity(0, speed)
	// 			break

	// 		case Direction.LEFT:
	// 			this.setVelocity(-speed, 0)
	// 			this.scaleX = -1
	// 			this.body.offset.x = 64
	// 			break

	// 		case Direction.RIGHT:
	// 			this.setVelocity(speed, 0)
	// 			this.scaleX = 1
	// 			this.body.offset.x = 0
	// 			break
	// 	}
	// }
}
