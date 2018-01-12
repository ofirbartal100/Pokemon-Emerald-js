export function createWindowLayer(x,y,width,height,text,style={font:"7px Arial",fill:"#FFF",border:"#000"}) {
    const buffer = document.createElement('canvas')
    buffer.width = width
    buffer.height = height
    const context = buffer.getContext('2d')
    context.font = style.font


    return function drawWindowLayer(canvasContext) {
        context.clearRect(0, 0, buffer.width, buffer.height)

        context.fillStyle = style.fill
        context.fillRect(0, 0,width,height)

        context.strokeStyle = style.border
        context.strokeRect(0, 0,width,height)

        if(text){
            context.fillStyle = "#000";
            context.fillText(text, 5, height/2 -7/2)
        }

        canvasContext.drawImage(buffer, x,y)
    }
}