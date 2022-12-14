import Phaser from 'phaser'

enum Direction
{
	UP,
	DOWN,
	LEFT,
	RIGHT
}

const randomDirection = (exclude: Direction) => {
	let newDirection = Phaser.Math.Between(0, 3)
	while (newDirection === exclude)
	{
		newDirection = Phaser.Math.Between(0, 3)
	}

	return newDirection
}

export default class Cultist extends Phaser.Physics.Arcade.Sprite
{
	private direction = Direction.RIGHT
	private moveEvent: Phaser.Time.TimerEvent

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
	{
		super(scene, x, y, texture, frame)

		this.anims.play('cultist-walk')

		scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this)

		this.moveEvent = scene.time.addEvent({
			delay: Phaser.Math.Between(6000,8000),
			callback: () => {
				this.direction = randomDirection(this.direction)
			},
			loop: true
		})
	}

	destroy(fromScene?: boolean)
	{
		this.moveEvent.destroy()

		super.destroy(fromScene)
	}

	private handleTileCollision(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile)
	{
		if (go !== this)
		{
			return
		}

		this.direction = randomDirection(this.direction)
	}

	preUpdate(t: number, dt: number)
	{
		super.preUpdate(t, dt)

		const speed = 5

		switch (this.direction)
		{
			case Direction.UP:
				this.setVelocity(0, -speed)
				break

			case Direction.DOWN:
				this.setVelocity(0, speed)
				break

			case Direction.LEFT:
				this.setVelocity(-speed, 0)
				this.scaleX = -0.6
				this.body.offset.x = 50
				break

			case Direction.RIGHT:
				this.setVelocity(speed, 0)
				this.scaleX = 0.6
				this.body.offset.x = 0
				break
		}
	}
}
