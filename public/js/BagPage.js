const BATTLE = 0
const INFO = 1
import GraphicPage from './GraphicPage.js'

export default class BagPage extends GraphicPage{
    constructor() {
        super()
        this.menuType = INFO
        this.bag
        window.bb = this
    }

    move(direction, state) {
        if (!state) {
            return
        }
        if (direction == 'ArrowUp') {

        } else if (direction == 'ArrowDown') {

        } else if (direction == 'ArrowRight') {

        } else if (direction == 'ArrowLeft') {

        }
    }

    action(command, state) {
        if (!state) {
            return
        }
        if (command == Commands[0]) {

        } else if (command == Commands[1]) {

        } else if (command == Commands[2]) {

        }
    }

    update(deltaTime) {
        if (this.active) {

        }
    }

    draw(context) {
        if (this.active) {

        }
    }
}