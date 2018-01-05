export function createDialogLayer(dialog) {
    const margin = 5
    const buffer = document.createElement('canvas')
    buffer.width = 240 - 2 * margin
    buffer.height = 40
    const context = buffer.getContext('2d')
    context.font = "7px Arial";


    return function drawDialogLayer(canvasContext) {
        context.clearRect(0, 0, buffer.width, buffer.height)
        context.fillStyle = "#FFF";
        context.fillRect(0, 0, buffer.width, buffer.height);
        canvasContext.drawImage(buffer, margin, 160 - buffer.height - margin)

        context.clearRect(0, 0, buffer.width, buffer.height)
        //write
        context.fillStyle = "#000";
        context.fillText(dialog, 0, 7)

        canvasContext.drawImage(buffer, margin, 160 - buffer.height - margin)
    }
}