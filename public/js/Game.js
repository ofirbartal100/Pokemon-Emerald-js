import Camera from './Camera.js'
import Timer from './Timer.js'
import Menu from './Menu.js'
import Dialog from './Dialog.js'

export default class Game {
    constructor() {
        this.camera = new Camera()
        this.menu = new Menu()
        this.dialog = new Dialog()
        this.timer = new Timer(1 / 60)
        this.location = null
        this.player = null
    }

    setPlayer(entity) {
        if (this.location) {
            this.player = entity
            this.location.entities.add(this.player)
        }
    }

    update(deltaTime) {
        if (this.location) {
            this.location.update(deltaTime)
        }
        this.menu.update(deltaTime)
        this.dialog.update(deltaTime)
    }

    draw(context) {
        if (this.location) {
            this.location.focus(this.camera, this.player)
            this.location.comp.draw(context, this.camera)
        }
        this.menu.draw(context)
        this.dialog.draw(context)
    }

}