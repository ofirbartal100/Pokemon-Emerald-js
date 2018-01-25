import BagPage from '../BagPage.js'
import { loadJSON, loadImage } from './spriteSheet.js'

export function loadBagPage(bp) {
	let bagPage
    if (bp) {
        bagPage = bp
    } else {
        bagPage = new BagPage()
    }
    return loadJSON('../../pokemon/bagGraphics.json').then(graphicsUrls => {
        return Promise.all(graphicsUrls.urls.map(loadImage))
            .then(images => {
                bagPage.graphics = images
                return bagPage
            })
    })
}
