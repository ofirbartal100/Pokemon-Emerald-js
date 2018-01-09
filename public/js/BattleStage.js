import { createBattleStageLayer } from './layers/battleStage.js'
import { Commands } from './input.js'
import Dialog from './Dialog.js'

export default class BattleStage {
    constructor() {
        this.dialog = new Dialog()
        this.active = false
        this.battle = null
    }

    end(){
        this.active = false
        this.battle = null
        this.dialog = new Dialog()
    }

    drawBackground(context){

    }

    drawDialog(context){
        this.dialog.draw(context)
    }

    update(deltaTime) {
        this.dialog.updateComponent(deltaTime)
        this.layer = createBattleStageLayer(this.battle, this.dialog)
    }

    draw(context) {
        if (this.active)
            this.layer(context)
    }

}