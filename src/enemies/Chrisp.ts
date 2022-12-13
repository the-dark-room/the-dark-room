import Phaser from 'phaser'

export default class Chrisp extends Phaser.Physics.Arcade.Sprite
{
	private health = 50

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
	{
		super(scene, x, y, texture, frame)

		this.anims.play('chrisp-walk')
	}

	gotHit() {
    this.health--
		this.scene.sound.play("chrisp-hurt", {
      volume: 0.2,
    });
		// For future use:
		// this.anims.play('chrisp-damage')
    if (this.health <= 0) { this.destroy() }
  }

	// For future use:
  // swing() {
	// 	console.log('Chrisp swung')

	// 	this.setSize(50,50)
	// 	// this.scene.chrispSwingBox.body.enable = true

	// 	// this.scene.chrispSwingBox!.y = this.y
	// 	// this.scene.chrispSwingBox!.x = this.x

	// 	// this.anims.play('chrisp-swing')
  // }


  getHealth() {
    return this.health
  }

	destroy(fromScene?: boolean)
	{
		// for future use:
		// this.anims.play('chrisp-death')

		// this.moveEvent.destroy()

		super.destroy(fromScene)
	}
	// For future use:
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
