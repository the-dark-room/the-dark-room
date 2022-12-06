import createGhostAnims from './GhostAnims'  //GHOST
import createBodAnims from './BodAnims'  //BOD
import createFrogAnims from './FrogAnims'	//FROG
import createSkeletonAnims from './SkeletonAnims'	//SKELETON
import createBatAnims from './BatAnims'  //BAT
import createCultistAnims from './CultistAnims'  //CULTIST
import createChrispAnims from './ChrispAnims'  //CHRISP
import createBearTrapAnims from './BearTrapAnims'  //BEAR TRAP
import createFireTrapAnims from './FireTrapAnims'  //FIRE TRAP

import { createCharacterAnims } from './CharacterAnims'
import { createChestAnims } from './TreasureAnims'

function loadAllAnims(anim){
    createGhostAnims(anim)
    createBodAnims(anim)
    createFrogAnims(anim)
    createSkeletonAnims(anim)
    createBatAnims(anim)
    createCultistAnims(anim)
    createChrispAnims(anim)
    createBearTrapAnims(anim)
    createFireTrapAnims(anim)

    createCharacterAnims(anim)
    createChestAnims(anim)
}

export { loadAllAnims }