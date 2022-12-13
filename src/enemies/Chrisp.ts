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

		super.destroy(fromScene)
	}
}
