import GraphicPage from '../GraphicPage.js'
import { loadJSON, loadImage } from './spriteSheet.js'

//pageType => {bag , battle , party, trainerCard}
export function loadGraphicPage(gp,pageType) {
	let graphicPage
    if (gp) {
        graphicPage = gp
    } else {
        //?graphicPage = new GraphicPage()
    }
    return loadJSON('../../pokemon/'+pageType+'Graphics.json').then(graphicsUrls => {
        return Promise.all(graphicsUrls.urls.map(loadImage))
            .then(images => {
                graphicPage.graphics = images
                return graphicPage
            })
    })
}