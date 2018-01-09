import { createDialogLayer } from './layers/dialog.js'
import { Commands } from './input.js'

export default class Dialog {
    constructor() {
        this.messages = []
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
                this.phase = this.phase + 1
            }
        } else if (command == Commands[1]) {
            if (state) {
                this.phase = this.phase + 1
            }
        } else if (command == Commands[2]) {
            if (state) {
                this.phase = this.phase + 1
            }
        }
    }

    loadBattle(battle){
        if(this.phase >= 0){
            return
        }
        this.battle = battle
        this.phase = 0
        this.messages.push(`A wild ${battle.pokemon.name} appeared!`)
        this.messages.push(`I choose you! ${battle.player.party.pokemons[0].name}!`)
        this.messages.push(`What will\n${battle.player.party.pokemons[0].name} do?`)
    }

    update(deltaTime) {
        this.layer = createDialogLayer(this.messages[this.phase])
    }

    updateComponent(deltaTime) {
        //this.layer = createDialogLayer(this.messages[this.phase])
    }

    drawComponent(context){
        createDialogLayer(this.messages[this.phase])(context)
        // createBattleMenu(context)
    }

    draw(context) {
        if (this.active)
            this.layer(context)
    }

}