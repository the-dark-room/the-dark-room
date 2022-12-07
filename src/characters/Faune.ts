//TODO: during development, remove the nocheck below to find possible errors
//It's there because sword doesn't exist on the scene until runtime

// @ts-nocheck
import Phaser from 'phaser'
import Chest from '../items/Chest'

import { sceneEvents } from '../events/EventsCenter'

declare global
{
	namespace Phaser.GameObjects
	{
		interface GameObjectFactory
		{
			faune(x: number, y: number, texture: string, frame?: string | number): Faune
		}
	}
}

enum HealthState
{
	IDLE,
	DAMAGE,
	DEAD
}

export default class Faune extends Phaser.Physics.Arcade.Sprite
{
	private healthState = HealthState.IDLE
	private damageTime = 0

	private _health = 3
	private _coins = 0


	private faceUp = false
	private faceDown = true
	private isAtacking = false

	private knives!: Phaser.Physics.Arcade.Group
	private meleeHitbox!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
	private activeChest?: Chest

	get health()
	{
		return this._health
	}

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
	{
		super(scene, x, y, texture, frame)

		this.anims.play('faune-idle-down')

		//knives initialize
		this.scene.knives = this.scene.physics.add.group({
			classType: Phaser.Physics.Arcade.Image,
			maxSize: 200
		})

		this.knives = this.scene.knives

		//melleHitbox for sword initialize
		this.scene.meleeHitbox = this.scene.add.rectangle(0, 0, 25, 20, 0xffffff, 0) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody
		this.meleeHitbox = this.scene.meleeHitbox

		this.scene.physics.add.existing(this.scene.meleeHitbox)
		this.scene.meleeHitbox.body.enable = false

		//Sword animation initialize
		this.scene.anims.create({
			key: 'swing',
			frames: [
					{ key: 'sword2' },
					{ key: 'sword3' },
					{ key: 'sword4' },
			],
			frameRate: 8,
			repeat: 0
		})

		this.scene.sword = this.scene.add.sprite(45, 40, 'sword1').setVisible(false)
		this.scene.sword.setScale(0.5)

		this.scene.sword.on('animationcomplete', () => {
			this.scene.meleeHitbox.body.enable = false
			this.scene.sword.setVisible(false)
			this.isAtacking = false
		})
	}

	setChest(chest: Chest)
	{
		this.activeChest = chest
	}

	handleDamage(dir: Phaser.Math.Vector2) {
		if (this._health <= 0){
			return
		}

		if (this.healthState === HealthState.DAMAGE){
			return
		}

		--this._health

		if (this._health <= 0){
			// TODO: die
			this.healthState = HealthState.DEAD
			this.anims.play('faune-faint')
			this.setVelocity(0, 0)
		}
		else{
			this.setVelocity(dir.x, dir.y)

			this.setTint(0xff0000)

			this.healthState = HealthState.DAMAGE
			this.damageTime = 0
		}
	}

	private swingSword(){
	// TODO: create sword swing hit box
		this.isAtacking = true
		this.meleeHitbox.body.enable = true
		this.scene.sword.setVisible(true)
		this.scene.sword.play('swing', false)

		if (this.faceUp){
			this.meleeHitbox!.y = this.y - this.height * 0.4
			this.meleeHitbox!.x = this.x

			this.scene.sword.setDepth(0)
			this.scene.sword.y = this.y - 10
			this.scene.sword.x = this.x - 5
			this.scene.sword.setAngle(-90)
		}
		else if (this.faceDown){
			this.meleeHitbox!.y = this.y + this.height * 0.5
			this.meleeHitbox!.x = this.x

			this.scene.sword.setDepth(2)
			this.scene.sword.y = this.y + this.height * 0.5 + 4
			this.scene.sword.x = this.x + 6
			this.scene.sword.setAngle(125)
		}
		else {
			this.meleeHitbox!.y = this.y + this.height * 0.1

			this.meleeHitbox!.x = this.flipX
			? this.x - this.width * 0.35
			: this.x + this.width * 0.35

			this.scene.sword.setAngle(0)
			this.scene.sword.y = this.y + this.height * 0.1

			this.scene.sword.x = this.flipX
			? this.x - this.width * 0.35
			: this.x + this.width * 0.35
		}
	}

	private throwKnife(){
		if (!this.knives){
			return
		}

		const knife = this.knives.get(this.x, this.y, 'knife') as Phaser.Physics.Arcade.Image
		if (!knife){
			return
		}

		const parts = this.anims.currentAnim.key.split('-')
		const direction = parts[2]

		const vec = new Phaser.Math.Vector2(0, 0)

		switch (direction){
			case 'up':
				vec.y = -1
				break

			case 'down':
				vec.y = 1
				break

			default:
			case 'side':
				if (this.flipX){
					vec.x = -1
				}
				else{
					vec.x = 1
				}
				break
		}

		const angle = vec.angle()

		knife.setActive(true)
		knife.setVisible(true)

		knife.setRotation(angle)

		knife.x += vec.x * 16
		knife.y += vec.y * 16

		knife.setVelocity(vec.x * 50, vec.y * 50)
	}

	preUpdate(t: number, dt: number){

		super.preUpdate(t, dt)

		switch (this.healthState){
			case HealthState.IDLE:
				break

			case HealthState.DAMAGE:
				this.damageTime += dt
				if (this.damageTime >= 250){
					this.healthState = HealthState.IDLE
					this.setTint(0xffffff)
					this.damageTime = 0
				}
				break
		}
	}

	update(cursors: Phaser.Types.Input.Keyboard.CursorKeys){
		if (this.healthState === HealthState.DAMAGE
			|| this.healthState === HealthState.DEAD
		){
			return
		}

		if (!cursors){
			return
		}

		if (Phaser.Input.Keyboard.JustDown(cursors.space!)) {
			this.throwKnife()
			return
		}

		this.scene.input.on('pointerdown', function (pointer) {
			if (pointer.leftButtonDown()){
				if (this.activeChest){
					const coins = this.activeChest.open()
					this._coins += coins

					sceneEvents.emit('player-coins-changed', this._coins)
				}
				else //sword swing
				{
					this.swingSword()
				}
				return
			}
		}, this);

		const speed = 100

		this.cursors = this.scene.input.keyboard.addKeys(
			{up:Phaser.Input.Keyboard.KeyCodes.W,
			down:Phaser.Input.Keyboard.KeyCodes.S,
			left:Phaser.Input.Keyboard.KeyCodes.A,
			right:Phaser.Input.Keyboard.KeyCodes.D
		})

		const leftDown = this.cursors.left?.isDown
		const rightDown = this.cursors.right?.isDown
		const upDown = this.cursors.up?.isDown
		const downDown = this.cursors.down?.isDown

		if (leftDown && !this.isAtacking){
			this.anims.play('faune-run-side', true)
			this.setVelocity(-speed, 0)
			this.flipX = true
			this.scene.sword.flipX = true

			this.faceUp = false
			this.faceDown = false
		}
		else if (rightDown && !this.isAtacking){
			this.anims.play('faune-run-side', true)
			this.setVelocity(speed, 0)
			this.flipX = false
			this.scene.sword.flipX = false

			this.faceUp = false
			this.faceDown = false
		}
		else if (upDown && !this.isAtacking){
			this.anims.play('faune-run-up', true)
			this.setVelocity(0, -speed)

			this.scene.sword.flipX = false

			this.faceUp = true
			this.faceDown = false
		}
		else if (downDown && !this.isAtacking){
			this.anims.play('faune-run-down', true)
			this.setVelocity(0, speed)

			this.scene.sword.flipX = false

			this.faceDown = true
			this.faceUp = false
		}
		else{
			const parts = this.anims.currentAnim.key.split('-')
			parts[1] = 'idle'
			this.anims.play(parts.join('-'))
			this.setVelocity(0, 0)
		}

		if (leftDown || rightDown || upDown || downDown){
			this.activeChest = undefined
		}
	}
}

Phaser.GameObjects.GameObjectFactory.register('faune', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
	var sprite = new Faune(this.scene, x, y, texture, frame)

	this.displayList.add(sprite)
	this.updateList.add(sprite)

	this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

	sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8)

	return sprite
})
