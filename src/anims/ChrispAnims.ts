import Phaser from 'phaser'

const createChrispAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'chrisp-walk',
		frames: anims.generateFrameNames('chrisp', { start: 27, end: 32, prefix: 'chrisp-', suffix: '.png' }),
		repeat: -1,
		frameRate: 10
	})

	anims.create({
		key: 'chrisp-death',
		frames: anims.generateFrameNames('chrisp-death', { start: 13, end: 25, prefix: 'chrisp-death-', suffix: '.png' }),
		repeat: -1,
		frameRate: 10
	})
}

export default createChrispAnims
