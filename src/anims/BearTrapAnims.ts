import Phaser from 'phaser'

const createBearTrapAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'beartrap-close',
		frames: anims.generateFrameNames('beartrap', { start: 0, end: 3, prefix: 'Bear_Trap-', suffix: '.png' }),
		// repeat: -1,
		frameRate: 10
	})
}

export default createBearTrapAnims
