import Phaser from 'phaser'

import { sceneEvents } from '../events/EventsCenter'

export default class GameUI extends Phaser.Scene
{
	private hearts!: Phaser.GameObjects.Group

	private flashTimer
	private flashTimerOutline
	private flashTimerWidth = 58

	constructor()
	{
		super({ key: 'game-ui' })
	}

	create()
	{
		// this.add.image(6, 26, 'treasure', 'coin_anim_f0.png')
		// const coinsLabel = this.add.text(12, 20, '0', {
		// 	fontSize: '14'
		// })

		// sceneEvents.on('player-coins-changed', (coins: number) => {
		// 	coinsLabel.text = coins.toLocaleString()
		// })

		this.hearts = this.add.group({
			classType: Phaser.GameObjects.Image
		})

		this.hearts.createMultiple({
			key: 'ui-heart-full',
			setXY: {
				x: 10,
				y: 10,
				stepX: 16
			},
			quantity: 3
		})

		sceneEvents.on('player-health-changed', this.handlePlayerHealthChanged, this)

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			sceneEvents.off('player-health-changed', this.handlePlayerHealthChanged, this)
			// sceneEvents.off('player-coins-changed')
		})


		this.flashTimer = this.add.graphics();
		this.flashTimer.fillStyle(0xffff00)
		this.flashTimer.fillRect(58, 5, this.flashTimerWidth, 10)

		this.flashTimerOutline = this.add.graphics();
		this.flashTimerOutline.lineStyle(1, 0xffffff, 1);
		this.flashTimerOutline.strokeRoundedRect(60, 4, 64, 12, 4);

	}

	private handlePlayerHealthChanged(health: number)
	{
		this.hearts.children.each((go, idx) => {
			const heart = go as Phaser.GameObjects.Image
			if (idx < health)
			{
				heart.setTexture('ui-heart-full')
			}
			else
			{
				heart.setTexture('ui-heart-empty')
			}
		})
	}

	update(){
		this.flashTimer.clear()
		
		if(this.flashTimerWidth > 0.5){
			
			this.flashTimer = this.add.graphics();
			this.flashTimer.fillStyle(0xffff00)
			this.flashTimer.fillRect(63, 5, this.flashTimerWidth, 10)
			this.flashTimerWidth -= 0.05
		}
		
	}
}
