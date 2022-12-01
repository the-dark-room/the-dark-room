import Phaser from 'phaser'

const createSkeletonAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'skeleton-walk',
		frames: anims.generateFrameNames('skeleton', { start: 0, end: 2, prefix: 'skeleton-', suffix: '.png' }),
		repeat: -1,
		frameRate: 10
	})
}

export default createSkeletonAnims
