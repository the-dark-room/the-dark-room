import Phaser from 'phaser'

const createChrispAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'chrisp-walk',
		frames: anims.generateFrameNames('chrisp', { start: 27, end: 32, prefix: 'chrisp-', suffix: '.png' }),
		repeat: -1,
		frameRate: 10
	})
}

export default createChrispAnims
