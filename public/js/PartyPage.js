import { createPartyPageLayer } from './layers/partyPage.js'
import { Commands } from './input.js'
import { Vec2 } from './math.js'

const BATTLE = 0
const INFO = 1
const PARTY = 0
const MENU = 1

export default class PartyPage {
    constructor() {
        this.active = false
        this.menuType = INFO
        this.graphics
        this.party
        this.partyCursor = new Vec2(0, 0)
        this.stage = PARTY
        window.pp = this
    }

    move(direction, state) {
        if (!state) {
            return
        }
        let yMod = Math.min(3, this.party.pokemons.length / 2) + 1
        if (direction == 'ArrowUp') {
            this.partyCursor.y = (this.partyCursor.y + yMod - 1) % yMod //-1mod yMod
        } else if (direction == 'ArrowDown') {
            this.partyCursor.y = (this.partyCursor.y + 1) % yMod
        } else if (direction == 'ArrowRight') {
            this.partyCursor.x = (this.partyCursor.x + 1) % 2
        } else if (direction == 'ArrowLeft') {
            this.partyCursor.x = (this.partyCursor.x + 1) % 2 //-1mod2
        }
    }

    action(command, state) {
        if (!state) {
            return
        }
        if (command == Commands[0]) {
            this.choose()
        } else if (command == Commands[1]) {
            this.back()
        } else if (command == Commands[2]) {

        }
    }

    choose() {
        switch (this.stage) {
            case PARTY:
                if (this.partyCursor.y == Math.min(4, this.party.pokemons.length / 2 + 1) -1 ){
                    this.back()
                }
                else{
                    this.openMenu()
                }
                break

            case MENU:

                break
        }
    }

    openMenu() {
        this.stage = MENU
    }

    back() {
        switch (this.stage) {
            case PARTY:
                this.active = false
                this.partyCursor.set(0,0)
                break

            case MENU:
                this.closeMenu()
                break
        }
    }

    closeMenu() {
        this.stage = PARTY
    }

    update(deltaTime) {
        if (this.active) {
            this.layer = createPartyPageLayer(this.party, this.graphics)
        }
    }

    draw(context) {
        if (this.active) {
            this.layer(context)
        }
    }
}