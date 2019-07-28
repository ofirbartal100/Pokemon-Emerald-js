export function createMenuLayer(menu) {
    const margin = 5
    const buffer = document.createElement('canvas')
    buffer.width = 240 / 4
    buffer.height = 160 - 2 * margin
    const context = buffer.getContext('2d')


    return function drawMenuLayer(canvasContext) {
        context.clearRect(0, 0, buffer.width, buffer.height)
        context.fillStyle = "#FFF";
        context.fillRect(0, margin, buffer.width - margin, buffer.height);
        canvasContext.drawImage(buffer, 240 - buffer.width, 0)


        let i = 0
        for (let item of menu.items) {
            context.clearRect(0, 0, buffer.width, buffer.height)
            //write
            menu.font.putText(item, 0, margin + (buffer.height * i / 5), context)
            //select
            if (i == menu.controller.menuCursor) {
                context.strokeStyle = "red";
                context.strokeRect(0, margin + (buffer.height * i / 5), buffer.width - margin, 13)
            }

            canvasContext.drawImage(buffer, 240 - buffer.width, 0)
            i++
        }

    }
}

