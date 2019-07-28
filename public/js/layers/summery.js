export function createSummeryLayer(pokemon,graphics) {
    const buffer = document.createElement('canvas')
    buffer.width = 240
    buffer.height = 160
    const context = buffer.getContext('2d')
    const summerys = [graphics[29],graphics[30],graphics[31],graphics[32],graphics[33]]

    return function drawSummeryLayer(canvasContext,index) {
        context.clearRect(0, 0, buffer.width, buffer.height)
        context.drawImage(summerys[index], 0, 0, buffer.width, buffer.height)
        context.drawImage(pokemon.front, 15, 60, 64, 64)

        context.fillText(pokemon.name,15,35)
        context.fillText(pokemon.level,22,48)
        canvasContext.drawImage(buffer, 0, 0)
    }
}