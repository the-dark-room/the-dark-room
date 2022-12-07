import Phaser from "phaser";

import Preloader from "./scenes/Preloader";
import Game from "./scenes/Game";
import GameUI from "./scenes/GameUI";
import Menu from "./scenes/Menu";
import Winner from "./scenes/Winner";
import Loser from "./scenes/Loser";

import PhaserRaycaster from "phaser-raycaster";
import EnterName from "./scenes/EnterName";
import LeaderBoard from "./scenes/LeaderBoard";

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 400,
  height: 250,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [Preloader, Game, GameUI, Menu, Winner, Loser, EnterName, LeaderBoard],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  parent: "phaser",
  dom: {
    createContainer: true,
  },
  plugins: {
    scene: [
      {
        key: "PhaserRaycaster",
        plugin: PhaserRaycaster,
        mapping: "raycasterPlugin",
      },
    ],
  },
});
