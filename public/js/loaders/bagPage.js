import BagPage from '../BagPage.js'
import { loadJSON, loadImage } from './spriteSheet.js'

export function loadBagPage() {
    return loadJSON('../../pokemon/bagGraphics.json').then(graphicsUrls => {
        return Promise.all(graphicsUrls.urls.map(loadImage))
            .then(images => {
                const bagPage = new BagPage()
                bagPage.graphics = images
                return bagPage
            })
    })
}