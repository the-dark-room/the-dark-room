import Phaser from 'phaser'

const createCultistAnims = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'cultist-walk',
		frames: anims.generateFrameNames('cultist', { start: 0, end: 7, prefix: 'cultist-', suffix: '.png' }),
		repeat: -1,
		frameRate: 10
	})
}

export default createCultistAnims
