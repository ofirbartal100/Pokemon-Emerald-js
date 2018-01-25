import PartyPage from '../PartyPage.js'
import { loadJSON, loadImage } from './spriteSheet.js'

export function loadPartyPage(pp) {
	let partyPage
    if (pp) {
        partyPage = pp
    } else {
        partyPage = new PartyPage()
    }
    return loadJSON('../pokemon/partyGraphics.json').then(graphicsUrls => {
        return Promise.all(graphicsUrls.urls.map(loadImage))
            .then(images => {
                partyPage.graphics = images
                return partyPage
            })
    })
}