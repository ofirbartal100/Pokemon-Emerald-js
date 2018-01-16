import { createMenuLayer } from './layers/menu.js'
import { Commands } from './input.js'

export default class Menu {
    constructor() {
        this.items = ['Bag', 'Pokemons', 'Brendan', 'Save', 'Settings']
        this.focus = 0
        this.active = false
        this.player
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

    action(command, state) {
        if (!state) {
            return
        }
        if (command == Commands[0]) { // choose
            this.choose()
        } else if (command == Commands[1]) { // back
            this.back()
        }
    }

    choose() {
        if (this.items[this.focus] == 'Pokemons') {
            this.pokemonsAction(true)
        }
    }

    back() {
        if (this.items[this.focus] == 'Pokemons') {
            this.pokemonsAction(false)
        }
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