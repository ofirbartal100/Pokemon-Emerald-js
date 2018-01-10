import Dialog from './Dialog.js'
import { Commands } from './input.js'
import { Vec2 } from './math.js'

const UNINITIALIZED = -1
const INTRO = 0
const FIGHTING_MENU = 1
const MOVES_MENU = 2
const ACTION = 2
export default class BattleDialog extends Dialog {
    constructor() {
        super()
        this.stage = UNINITIALIZED

        this.fightingMenuCursor = new Vec2(0, 0)
        this.fightingMenuMessage
        this.fightingMenu = ['Fight', 'Pokemon', 'Bag', 'Run']

        this.movesCursor = new Vec2(0, 0)
    }

    move(direction, state) {
        if (!state) {
            return
        }
        let cursor
        if (this.stage == FIGHTING_MENU) {
            cursor = this.fightingMenuCursor
        } else if (this.stage == MOVES_MENU) {
            cursor = this.movesCursor
        }

        if (direction == 'ArrowUp') {
            if (state) {
                cursor.y = 0
            }
        } else if (direction == 'ArrowDown') {
            if (state) {
                cursor.y = 1
            }
        } else if (direction == 'ArrowLeft') {
            if (state) {
                cursor.x = 0
            }
        } else if (direction == 'ArrowRight') {
            if (state) {
                cursor.x = 1
            }
        }
    }

    action(command, state) {
        if (!state) {
            return
        }
        if (command == Commands[0]) { // choose
            this.choose()
            if (this.stage < ACTION) {
                this.stage++
            }
        } else if (command == Commands[1]) { // back
            if (this.stage == INTRO) {

            } else{
                this.stage = this.stage - 1 > FIGHTING_MENU ? this.stage - 1 : FIGHTING_MENU
            }
        }
    }

    choose() {
        if (this.stage == INTRO) {
            this.nextMessage()
        } else if (this.stage == FIGHTING_MENU) {
            this.chooseFromFightingMenu()
        } else if (this.stage == MOVES_MENU) {
            this.chooseFromMoves()
        }
    }

    chooseFromFightingMenu() {
        const optionIndex = this.fightingMenuCursor.x + this.fightingMenuCursor.y * 2
        const option = this.fightingMenu[optionIndex]
        console.log(option)
    }

    chooseFromMoves() {
        const optionIndex = this.movesCursor.x + this.movesCursor.y * 2
        const option = this.fightingPokemon.attacks[optionIndex]
        console.log(option)
    }

    loadBattle(battle) {
        if (this.stage != UNINITIALIZED) {
            return
        }
        this.stage = INTRO
        this.battle = battle
        this.fightingPokemon = battle.player.party.pokemons[0]
        this.fightingMenuMessage = `What will\n${this.fightingPokemon.name} do?`
        this.initMessages()
        this.addMessages([`A wild ${battle.pokemon.name} appeared!`,
                        `I choose you! ${this.fightingPokemon.name}!`])
        
    }
}