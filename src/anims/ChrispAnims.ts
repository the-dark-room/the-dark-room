import Phaser from 'phaser'

const createChrispAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'chrisp-walk',
		frames: anims.generateFrameNames('chrisp', { start: 27, end: 32, prefix: 'chrisp-', suffix: '.png' }),
		repeat: -1,
		frameRate: 10
	})

	// anims.create({
	// 	key: 'chrisp-death',
	// 	frames: anims.generateFrameNames('chrisp-death', { start: 13, end: 25, prefix: 'chrisp-death-', suffix: '.png' }),
	// 	// repeat: -1,
	// 	frameRate: 10
	// })

	// anims.create({
	// 	key: 'chrisp-damage',
	// 	frames: anims.generateFrameNames('chrisp-damage', { start: 42, end: 44, prefix: 'chrisp-damage-', suffix: '.png' }),
	// 	// repeat: -1,
	// 	frameRate: 10
	// })

	anims.create({
		key: 'chrisp-swing',
		frames: anims.generateFrameNames('chrisp-swing', { start: 0, end: 12, prefix: 'chrisp-swing-', suffix: '.png' }),
		// repeat: -1,
		frameRate: 10
	})
}

export default createChrispAnims
