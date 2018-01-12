import { createDialogLayer } from './layers/dialog.js'
import { Commands } from './input.js'

export default class Dialog {
    constructor() {
        this.messages = []
        this.options = ['Yes','No']
        this.messagePhase = -1
        this.focus = 0
        this.active = false
    }

    initMessages(offset = 0){
        this.active = true
        this.messagePhase = offset
    }

    addMessages(messages){
        for(let message of messages){
            this.messages.push(message)
        }
    }

    clearMessages(){
        this.messagePhase = 0
        this.messages = []
    }

    nextMessage(){
        this.messagePhase = this.messagePhase + 1
        if(this.messages[this.messagePhase]==undefined){
            this.endOfMessageHandler()
        }
    }

    endOfMessageHandler(){
        this.clearMessages()
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

    action(command, state) {
        if (command == Commands[0]) {
            if (state) {
                this.nextMessage()
            }
        } else if (command == Commands[1]) {
            if (state) {
                this.nextMessage()
            }
        } else if (command == Commands[2]) {
            if (state) {
                this.nextMessage()
            }
        }
    }

    update(deltaTime) {
        this.layer = createDialogLayer(this.messages[this.messagePhase])
    }

    updateComponent(deltaTime) {
        //this.layer = createDialogLayer(this.messages[this.messagePhase])
    }

    drawComponent(context){
        createDialogLayer(this.messages[this.messagePhase])(context)
        // createBattleMenu(context)
    }

    draw(context) {
        if (this.active)
            this.layer(context)
    }

}