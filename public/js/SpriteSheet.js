import { createAnime, createTileAnime } from './anime.js'

export default class SpriteSheet {
    constructor(image, width, height) {
        this.image = image
        this.width = width
        this.height = height
        this.tiles = new Map()
        this.tilesTypes = new Map()
        this.animations = new Map()
        this.objects = new Map()
    }

    load(sheetSpec) {
        if (sheetSpec.tiles) {
            for (let tile of sheetSpec.tiles) {
                this.defineTile(tile.name, tile.type, tile.index[0], tile.index[1])
            }
        }
        if (sheetSpec.objects) {
            for (let object of sheetSpec.objects) {
                this.defineTiles(object.name, object.type, object.size, object.indexes)
            }
        }
        if (sheetSpec.frames) {
            for (let frameSpec of sheetSpec.frames) {
                this.define(frameSpec.name, frameSpec.type, ...frameSpec.rect)
            }
        }
        if (sheetSpec.animations) {
            for (let animeSpec of sheetSpec.animations) {
                let animation
                if (animeSpec.offsets) {
                    animation = createAnime(animeSpec.frames, animeSpec.offsets, animeSpec.frameLen)
                } else {
                    animation = createTileAnime(animeSpec.frames, animeSpec.frameLen)
                }
                this.defineAnime(animeSpec.name, animation)
            }
        }
    }

    defineAnime(name, animation) {
        this.animations.set(name, animation)
    }

    define(name, type = 'none', x, y, width, height) {
        const buffers = [false, true].map(flip => {
            const buffer = document.createElement('canvas')
            buffer.width = width
            buffer.height = height
            const context = buffer.getContext('2d')

            if (flip) {
                context.scale(-1, 1)
                context.translate(-width, 0)
            }

            context.drawImage(
                this.image,
                x, y, width, height,
                0, 0, width, height, )

            return buffer
        })
        this.tiles.set(name, buffers)
        this.tilesTypes.set(name, type)
    }

    defineTile(name, type = 'none', x, y) {
        this.define(name, type, x * this.width, y * this.height, this.width, this.height)
    }

    defineTiles(name, type = 'none', size, indexes) { // inclusive
        for (let x = 0; x < size[0]; x++) {
            for (let y = 0; y < size[1]; y++) {
                // console.log(`{"name":"${name}-${size[0]*y + x}",\n"type":"","index":[${indexes[size[0] * y + x][0]},${indexes[size[0] * y + x][1]}]},`)
                this.defineTile(`${name}-${size[0]*y + x}`, type, ...indexes[size[0] * y + x])
            }
        }
        this.objects.set(name, size)
    }

    draw(name, context, x, y, flip = false) {
        const buffer = this.tiles.get(name)[flip ? 1 : 0]
        context.drawImage(buffer, x, y)
    }

    drawTile(name, context, x, y) {
        this.draw(name, context, x * this.width, y * this.height)
    }

    drawBounds(location, context, x, y, startIndexX, startIndexY) {
        if (location.bounds.size) {
            let partX = (((x % location.bounds.size[0]) + location.bounds.size[0]) % location.bounds.size[0])
            let partY = (((y % location.bounds.size[1]) + location.bounds.size[1]) % location.bounds.size[1]) * location.bounds.size[0]
            let part = partX + partY
            let boundsPart = location.bounds.name + '-' + part
            this.drawTile(boundsPart, context, x - startIndexX, y - startIndexY)
        } else {
            this.drawTile(location.bounds.name, context, x - startIndexX, y - startIndexY)
        }
    }

    drawAnime(name, context, x, y, distance, flip = false) {
        const animation = this.animations.get(name)
        const { frameName, frameOffset } = animation(distance)
        this.draw(frameName, context, x, y, flip)
        return frameOffset
    }

    drawTileAnime(name, context, x, y, distance) {
        const animation = this.animations.get(name)
        this.drawTile(animation(distance), context, x, y)
    }
}