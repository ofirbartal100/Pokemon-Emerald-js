import { createBattleLayer } from './layers/battle.js'
import { Commands } from './input.js'
import BattleDialog from './BattleDialog.js'

export default class BattleStage {
    constructor() {
        this.active = false

        this.PartyPage = null
        this.BagPage = null
        this.battle = null

        this.battleData
    }

    move(direction, keyState) {
        if (this.PartyPage.active) {
            this.PartyPage.move(direction, keyState)
        } else if (this.BagPage.active) {

        } else {
            this.battle.move(direction, keyState)
        }
    }

    action(command, state) {
        if (this.PartyPage.active) {
            this.PartyPage.action(command, state)
        } else if (this.BagPage.active) {

        } else {
            this.battle.action(command, state)
        }
    }

    init(battle) {
        battle.dialog = new BattleDialog(this)
        battle.init(this.getPokemon, this.battleData.moves, this.battleData.typeTable)
        this.battle = battle
        this.PartyPage.battleMod()
        this.active = true
    }

    end() {
        this.active = false
        
        this.battle.end()
        this.battle = null

        this.PartyPage.infoMod()
        this.PartyPage.party.fightingPokemon = 0

    }

    activateParty() {
        this.PartyPage.active = true
    }

    activateBag() {

    }

    update(deltaTime) {
        if (this.active) {
            if (this.PartyPage.active) {
                this.PartyPage.update(deltaTime)
                this.layer = this.PartyPage.layer
            } else if (this.BagPage.active) {
                //this.layer = createBagLayer(this.battle)
            } else {
                this.battle.update(deltaTime)
                this.layer = createBattleLayer(this.battle)
            }
        }
    }

    draw(context) {
        if (this.active) {
            if (this.PartyPage.active) {
                this.PartyPage.layer(context)
            } else if (this.BagPage.active) {
                //this.BagPage.layer(context)
            } else {
                this.layer(context)
            }
        }
    }

}