export function setupMouseControl(canvas, entity, camera) {
    let lastEvent

    const mouseEvents = ['mousedown', 'mousemove']
    mouseEvents.forEach(eventName => {
        canvas.addEventListener(eventName, event => {
            if (event.buttons === 1) {
                entity.vel.set(0, 0)
                entity.pos.set(event.offsetX + camera.pos.x, event.offsetY + camera.pos.y)
            } else if (event.buttons === 2 &&
                lastEvent && lastEvent.buttons === 2 &&
                lastEvent.type === 'mousemove') {
                camera.pos.x -= event.offsetX - lastEvent.offsetX
                camera.pos.y -= event.offsetY - lastEvent.offsetY
            }
            lastEvent = event
        })
    })

    canvas.addEventListener('contextmenu', event => {
        event.preventDefault()
    })
}

export function indexLogger(canvas , camera) {
    canvas.addEventListener('click', function(event) {
        console.log('indexLogger:')
        console.log(Math.floor((event.offsetX + camera.pos.x) / 16), Math.floor((event.offsetY + camera.pos.y) / 16))
    });
}