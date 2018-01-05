export function createMenuLayer(menu) {
    const margin = 5
    const buffer = document.createElement('canvas')
    buffer.width = 240 / 4
    buffer.height = 160 - 2 * margin
    const context = buffer.getContext('2d')
    context.font = "10px Arial";


    return function drawMenuLayer(canvasContext) {
        context.clearRect(0, 0, buffer.width, buffer.height)
        context.fillStyle = "#FFF";
        context.fillRect(0, margin, buffer.width - margin, buffer.height);
        canvasContext.drawImage(buffer, 240 - buffer.width, 0)


        let i = 0
        for (let item of menu.items) {
            context.clearRect(0, 0, buffer.width, buffer.height)
            //write
            context.fillStyle = "#000";
            context.fillText(item, 0, 10 + margin + (buffer.height * i / 5))
            //select
            if (i == menu.focus) {
                context.strokeStyle = "red";
                context.strokeRect(0, margin + (buffer.height * i / 5), buffer.width - margin, 13)
            }
            canvasContext.drawImage(buffer, 240 - buffer.width, 0)
            i++
        }
    }
}