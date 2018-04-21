import { createMenuLayer } from './layers/menu.js'
import { Commands } from './input.js'

export default class Menu {
    constructor() {
        this.items = ['Bag', 'Pokemons', 'Brendan', 'Save', 'Settings']
        this.focus = 0
        this.active = false
        this.chosenItem = false
        this.player
        this.font
    }

    move(direction, state) {
        if (!state) {
            return
        }
        if (this.chosenItem) {
            this.feedForward('move', direction)
        } else {
            if (direction == 'ArrowUp') {
                this.focus = ((this.focus - 1) + this.items.length) % this.items.length
            } else if (direction == 'ArrowDown') {
                this.focus = ((this.focus + 1) + this.items.length) % this.items.length
            }
        }

    }

    action(command, state) {
        if (!state) {
            return
        }
        if (command == Commands[0]) { // choose
            if (!this.chosenItem)
                this.choose()
            else
                this.feedForward('action', command)

        } else if (command == Commands[1]) { // back
            if (!this.chosenItem)
                this.close()
            else
                this.feedForward('action', command)
        }
    }

    choose() {
        this.chosenItem = this.items[this.focus]
        this.routAction('init', true)
    }

    close() {
        this.active = false
    }

    feedForward(command, value) {
        this.routAction(command, value)
    }

    update(deltaTime) {
        if (this.active) {
            this.layer = createMenuLayer(this)
        }
    }

    draw(context) {
        if (this.active)
            this.layer(context)
    }

}