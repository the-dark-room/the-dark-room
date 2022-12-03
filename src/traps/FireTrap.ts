import Phaser from 'phaser'


export default class FireTrap extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
	{
		super(scene, x, y, texture, frame)
	}

	start(){
		this.anims.play('firetrap-start')
	}
}
