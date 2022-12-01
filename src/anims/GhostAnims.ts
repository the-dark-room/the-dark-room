import Phaser from 'phaser'

const createGhostAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'ghost-float',
		frames: anims.generateFrameNames('ghost', { start: 0, end: 5, prefix: 'ghost-', suffix: '.png' }),
		repeat: -1,
		frameRate: 10
	})
}

export default createGhostAnims
