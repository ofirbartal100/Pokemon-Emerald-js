import BattleStage from '../BattleStage.js'
import { loadJSON, loadImage } from './spriteSheet.js'

export function loadBattleStage(bs) {
	let battleStage
    if (bs) {
        battleStage = bs
    } else {
        battleStage = new BattleStage()
    }
    return loadJSON('../../pokemon/battleGraphics.json').then(graphicsUrls => {
        return Promise.all(graphicsUrls.urls.map(loadImage))
            .then(images => {
            	battleStage.graphics = images
                return battleStage
            })
    })
}