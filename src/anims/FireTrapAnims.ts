import Phaser from 'phaser'

const createFireTrapAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'firetrap-start',
		frames: anims.generateFrameNames('firetrap', { start: 0, end: 13, prefix: 'Fire_Trap-', suffix: '.png' }),
		// repeat: -1,
		frameRate: 10
	})
}

export default createFireTrapAnims
