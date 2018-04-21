import { createPartyPageLayer } from './layers/partyPage.js'
import PartyController from './controllers/partyController.js'
import { Commands } from './input.js'
import { Vec2 } from './math.js'

const DEFAULT = 0
const INFO = 1

export default class PartyPage {
    constructor() {
        this.controller = new PartyController(this)
        this.active = false
        this.mode = INFO
        this.graphics
        this.party
        this.pokemonMenu = ['SUMMERY', 'SWITCH', 'ITEM', 'CANCEL']
        this.chosenPokemon
        this.dialogPhrase = 'Choose a Pokemon.'
        window.pp = this
    }

    battleMod() {
        this.mode = DEFAULT
        this.pokemonMenu = ['SWITCH IN', 'SUMMERY', 'CANCEL']
    }

    infoMod() {
        this.mode = INFO
        this.pokemonMenu = ['SUMMERY', 'SWITCH', 'ITEM', 'CANCEL']
    }

    move(direction, state) {
        this.controller.move(direction, state)
    }

    action(command, state) {
        this.controller.action(command, state)
    }

    update(deltaTime) {
        if (this.active) {
            this.layer = createPartyPageLayer(deltaTime, this)
        }
    }

    draw(context) {
        if (this.active) {
            this.layer(context)
        }
    }
}