import SpriteSheet from '../SpriteSheet.js'

export function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image()
        image.addEventListener('load', () => {
            resolve(image)
        })
        image.src = url
    })
}

export function loadJSON(url) {
    return fetch(url).then(r => r.json())
}

export function loadSpriteSheet(name) {
    return loadJSON(`/sprites/${name}.json`)
        .then(sheetSpec => Promise.all([
            sheetSpec,
            loadImage(sheetSpec.imageUrl)
        ]))
        .then(([sheetSpec, image]) => {
            const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH)
            sprites.load(sheetSpec)
            return sprites
        })
}
