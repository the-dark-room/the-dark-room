import Phaser from "phaser";

import Preloader from "./scenes/Preloader";
import Game from "./scenes/Game";
import GameUI from "./scenes/GameUI";
import Menu from "./scenes/Menu";
import Winner from "./scenes/Winner";
import Loser from "./scenes/Loser";
import EnterName from "./scenes/EnterName";
import ExitClosed from "./scenes/ExitClosed";

import LeaderBoard from "./scenes/LeaderBoard";
import About from "./scenes/About";
import Controls from "./scenes/Controls";
import LoreTemplate from "./scenes/LoreTemplate";

import PhaserRaycaster from "phaser-raycaster";


export default new Phaser.Game({
  type: Phaser.AUTO,
  parent: "phaser",
  width: 400,
  height: 250,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      // debug: true,
    },
  },

  scene: [
    Preloader,
    Game,
    GameUI,
    Menu,
    Winner,
    Loser,
    EnterName,
    LeaderBoard,
    About,
    Controls,
    LoreTemplate,
    ExitClosed,
  ],

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  pixelArt: true, // looks better no touch
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
