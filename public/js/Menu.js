import { createMenuLayer } from './layers/menu.js'
import { Commands } from './input.js'

export default class Menu {
    constructor() {
        this.items = ['Bag', 'Brendan', 'Card', 'Save', 'Settings']
        this.focus = 0
        this.active = false
    }

    move(direction, state) {
        if (direction == 'ArrowUp') {
            if (state) {
                this.focus = ((this.focus - 1) + this.items.length) % this.items.length
            }
        } else if (direction == 'ArrowDown') {
            if (state) {
                this.focus = ((this.focus + 1) + this.items.length) % this.items.length
            }
        }
    }

    choose(command, state) {
        if (command == Commands[0]) {
            if (state) {
                this.focus = ((this.focus - 1) + this.items.length) % this.items.length
            }
        } else if (command == Commands[1]) {
            if (state) {
                this.focus = ((this.focus + 1) + this.items.length) % this.items.length
            }
        } else if (command == Commands[2]) {
            if (state) {
                this.focus = ((this.focus + 1) + this.items.length) % this.items.length
            }
        }
    }

    update(deltaTime) {
        this.layer = createMenuLayer(this)
    }

    draw(context) {
        if (this.active)
            this.layer(context)
    }

}