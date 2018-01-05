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