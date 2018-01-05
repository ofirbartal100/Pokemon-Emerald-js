import { createDialogLayer } from './layers/dialog.js'
import { Commands } from './input.js'

export default class Dialog {
    constructor() {
        this.messages = ['Bag', 'Brendan', 'Card', 'Save', 'Settings']
        this.options = ['Yes','No']
        this.phase = -1
        this.focus = 0
        this.active = false
    }

    move(direction, state) {
        if (direction == 'ArrowUp') {
            if (state) {
                this.focus = ((this.focus - 1) + this.options.length) % this.options.length
            }
        } else if (direction == 'ArrowDown') {
            if (state) {
                this.focus = ((this.focus + 1) + this.options.length) % this.options.length
            }
        }
    }

    choose(command, state) {
        if (command == Commands[0]) {
            if (state) {
                this.phase = ((this.phase + 1) + this.messages.length) % this.messages.length
            }
        } else if (command == Commands[1]) {
            if (state) {
                this.phase = ((this.phase + 1) + this.messages.length) % this.messages.length
            }
        } else if (command == Commands[2]) {
            if (state) {
                this.phase = ((this.phase + 1) + this.messages.length) % this.messages.length
            }
        }
    }

    update(deltaTime) {
        this.layer = createDialogLayer(this.messages[this.phase])
    }

    draw(context) {
        if (this.active)
            this.layer(context)
    }

}