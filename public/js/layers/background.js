import TileResolver from '../TileResolver.js';

export function createBackgroundLayer(location, tiles, sprites ,layer) {
    const resolver = new TileResolver(tiles);
    const buffer = document.createElement('canvas')
    buffer.width = 16 + 240 + 16
    buffer.height = 16 + 160 + 16

    const context = buffer.getContext('2d');
    
    let startIndexX, endIndexX, startIndexY, endIndexY

    function redraw(drawFromX, drawToX, drawFromY, drawToY) {
        context.clearRect(0, 0, buffer.width, buffer.height)
        
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
                    } else if (layer == 'background'){
                        let neighborTile = location.neighbors.getNeighborTile(x, y)
                        if (neighborTile) {
                            sprites.drawTile(neighborTile, context, x - startIndexX, y - startIndexY)
                        } else {
                            sprites.drawBounds(location, context, x, y, startIndexX, startIndexY)
                        }
                    }
                } else if (layer == 'background'){
                    let neighborTile = location.neighbors.getNeighborTile(x, y)
                    if (neighborTile) {
                        sprites.drawTile(neighborTile, context, x - startIndexX, y - startIndexY)
                    } else {
                        sprites.drawBounds(location, context, x, y, startIndexX, startIndexY)
                    }
                }
            }
        }
    }

    return function drawBackgroundLayer(context, camera ,getTileInIndex = undefined) {
        if(getTileInIndex){
            let col = tiles.grid[getTileInIndex[0]]
            if(col){
                let tile = col[getTileInIndex[1]]
                if(tile){
                    return tile.name
                }
            }
            return undefined
        }
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