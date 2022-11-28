import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
import GameUI from './scenes/GameUI'

export default new Phaser.Game({
	type: Phaser.AUTO,
	width: 400,
	height: 250,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true
		}
	},
	scene: [
		Preloader,
		Game, 
		GameUI,
	],
	scale: {
		mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
	}
})
