export function createBackgroundLayer(location, sprites) {
    const resolver = location.tileCollider.tiles
    const tiles = resolver.matrix

    const buffer = document.createElement('canvas')
    buffer.width = 16 + 240 + 16
    buffer.height = 16 + 160 + 16
    const context = buffer.getContext('2d')

    let startIndexX, endIndexX, startIndexY, endIndexY

    function redraw(drawFromX, drawToX, drawFromY, drawToY) {
        // if (drawFromX === startIndexX &&
        //     drawToX === endIndexX &&
        //     drawFromY === startIndexY &&
        //     drawToY === endIndexY)
        //     return
        startIndexX = drawFromX
        endIndexX = drawToX
        startIndexY = drawFromY
        endIndexY = drawToY

        for (let x = startIndexX; x <= endIndexX; x++) {
            for (let y = startIndexY; y <= endIndexY; y++) {
                let col = tiles.grid[x]
                if (col) {
                    let tile = col[y]
                    if (tile) {
                        if (sprites.animations.has(tile.name)) {
                            sprites.drawTileAnime(tile.name, context, x - startIndexX, y - startIndexY, location.totalTime)
                        } else {
                            sprites.drawTile(tile.name, context, x - startIndexX, y - startIndexY)
                        }
                    } else {
                        let neighborTile = location.neighbors.getNeighborTile(x, y)
                        if (neighborTile) {
                            sprites.drawTile(neighborTile.name, context, x - startIndexX, y - startIndexY)
                        } else {
                            sprites.drawBounds(location, context, x, y, startIndexX, startIndexY)
                        }
                    }
                } else {
                    let neighborTile = location.neighbors.getNeighborTile(x, y)
                    if (neighborTile) {
                        sprites.drawTile(neighborTile.name, context, x - startIndexX, y - startIndexY)
                    } else {
                        sprites.drawBounds(location, context, x, y, startIndexX, startIndexY)
                    }
                }
            }
        }
    }

    return function drawBackgroundLayer(context, camera) {
        const drawWidthX = resolver.toIndex(camera.size.x)
        const drawFromX = resolver.toIndex(camera.pos.x)
        const drawToX = drawFromX + drawWidthX
        const drawWidthY = resolver.toIndex(camera.size.y)
        const drawFromY = resolver.toIndex(camera.pos.y)
        const drawToY = drawFromY + drawWidthY

        redraw(drawFromX, drawToX, drawFromY, drawToY)
        let cameraDrawPosX = -(camera.pos.x % 16 + 16) % 16
        let cameraDrawPosY = -(camera.pos.y % 16 + 16) % 16

        context.drawImage(buffer, cameraDrawPosX, cameraDrawPosY)
    }
}

export function createSpriteLayer(entities, width = 64, height = 64) {
    const spriteBuffer = document.createElement('canvas')
    spriteBuffer.width = width
    spriteBuffer.height = height
    const spriteBufferContext = spriteBuffer.getContext('2d')

    return function drawSpriteLayer(context, camera) {
        entities.forEach(entity => {
            spriteBufferContext.clearRect(0, 0, width, height)
            entity.draw(spriteBufferContext)

            let x = entity.pos.x - camera.pos.x
            let y = entity.pos.y - camera.pos.y
            if (entity.offset) {
                x += entity.offset.x
                y += entity.offset.y
            }
            context.drawImage(spriteBuffer, x, y)
        })
    }
}


//debugg
export function createCollisionLayer(location) {
    const resolvedTiles = []
    const tileResolver = location.tileCollider.tiles
    const tileSize = tileResolver.tileSize

    const getByIndexOriginal = tileResolver.getByIndex

    tileResolver.getByIndex = function getByIndexFake(x, y) {
        resolvedTiles.push({ x, y })
        return getByIndexOriginal.call(tileResolver, x, y)
    }

    return function drawCollision(context, camera) {
        context.fillStyle = 'blue'
        resolvedTiles.forEach(({ x, y }) => {
            context.beginPath()
            context.rect(x * tileSize - camera.pos.x, y * tileSize - camera.pos.y, tileSize, tileSize)
            context.stroke()
        })
        resolvedTiles.length = 0


        location.entities.forEach(entity => {
            context.beginPath()
            context.rect(entity.bounds.left - camera.pos.x, entity.bounds.top - camera.pos.y, entity.size.x, entity.size.y)
            context.stroke()
        })
    }
}

export function createCameraLayer(cameraToDraw) {
    return function drawCameraRect(context, fromCamera) {
        context.strokeStyle = 'purple'
        context.beginPath()
        context.rect(
            cameraToDraw.pos.x - fromCamera.pos.x,
            cameraToDraw.pos.y - fromCamera.pos.y,
            cameraToDraw.size.x,
            cameraToDraw.size.y)
        context.stroke()
    }
}