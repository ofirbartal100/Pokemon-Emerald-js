import PartyPage from '../PartyPage.js'
import { loadJSON, loadImage } from './spriteSheet.js'

export function loadPartyPage() {
    return loadJSON('../pokemon/partyGraphics.json').then(graphicsUrls => {
        return Promise.all(graphicsUrls.urls.map(loadImage))
            .then(images => {
                const partyPage = new PartyPage()
                partyPage.graphics = images
                return partyPage
            })
    })
}