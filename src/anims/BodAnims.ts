import Phaser from 'phaser'

const createBodAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'bod-walk',
		frames: anims.generateFrameNames('bod', { start: 1, end: 8, prefix: 'Bringer-of-Death_Walk_', suffix: '.png' }),
		repeat: -1,
		frameRate: 5
	})
}

export default createBodAnims
