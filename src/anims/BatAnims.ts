import Phaser from 'phaser'

const createBatAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'bat-walk',
		frames: anims.generateFrameNames('bat', { start: 0, end: 2, prefix: 'bat-', suffix: '.png' }),
		repeat: -1,
		frameRate: 5
	})
}

export default createBatAnims
