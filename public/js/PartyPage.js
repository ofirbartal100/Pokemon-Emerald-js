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
        this.mode = INFO
        this.graphics
        this.party
        this.partyCursor = new Vec2(0, 0)
        this.partyMenuCursor = 0
        this.pokemonMenu = null
        this.chosenPokemon
        this.stage = PARTY
        window.pp = this
    }

    battleMod(){
        this.mode = BATTLE
    }

    infoMod(){
        this.mode = INFO
    }

    move(direction, state) {
        if (!state) {
            return
        }
        if (this.stage == PARTY) {
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
        } else if (this.stage == MENU) {
            if (direction == 'ArrowUp') {
                this.partyMenuCursor -= 1
            } else if (direction == 'ArrowDown') {
                this.partyMenuCursor += 1
            }
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
                if (this.partyCursor.y == Math.min(4, this.party.pokemons.length / 2 + 1) - 1) {
                    this.back()
                } else {
                    this.openMenu()
                }
                break

            case MENU:
                if(this.pokemonMenu[this.partyMenuCursor] == 'SWITCH IN'){
                    this.party.fightingPokemon = this.partyCursor.x + this.partyCursor.y * 2
                    this.exit()
                }
                break
        }
    }

    openMenu() {
        this.stage = MENU
        this.partyMenuCursor = 0
        this.chosenPokemon = this.party.pokemons[this.partyCursor.x + this.partyCursor.y * 2]
        if (this.mode == INFO) {
            this.pokemonMenu = ['SUMMERY', 'SWITCH', 'ITEM', 'CANCEL']
        } else if (this.mode == BATTLE) {
            this.pokemonMenu = ['SWITCH IN', 'SUMMERY', 'CANCEL']
        }
    }

    exit(){
        this.active = false
        this.partyCursor.set(0, 0)
        this.stage = PARTY
    }

    back() {
        switch (this.stage) {
            case PARTY:
                this.active = false
                this.partyCursor.set(0, 0)
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
            this.layer = createPartyPageLayer(deltaTime, this.party, this.graphics)
        }
    }

    draw(context) {
        if (this.active) {
            this.layer(context)
        }
    }
}