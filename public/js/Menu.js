import { createMenuLayer } from './layers/menu.js'
import { Commands } from './input.js'
import MenuController from './controllers/MenuController.js'

export default class Menu {
    constructor() {
        this.controller = new MenuController(this)
        this.items = ['Bag', 'Pokemons', 'Brendan', 'Save', 'Settings']
        this.focus = 0
        this.active = false
        this.chosenItem = false
        this.player
        this.font
    }
    move(direction, state) {
        this.controller.move(direction, state)
    }

    action(command, state) {
        this.controller.action(command, state)
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