import Phaser from 'phaser'

const createFrogAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'frog-walk',
		frames: anims.generateFrameNames('frog', { start: 0, end: 2, prefix: 'frog-', suffix: '.png' }),
		repeat: -1,
		frameRate: 15
	})
}

export default createFrogAnims
