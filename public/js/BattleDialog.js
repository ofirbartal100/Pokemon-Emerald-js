import Dialog from './Dialog.js'
import { Commands } from './input.js'
import { Vec2 } from './math.js'
import { createWindowLayer } from './layers/window.js'

const UNINITIALIZED = -1
const INTRO = 0
const FIGHTING_MENU = 1
const MOVES_MENU = 2
const ACTION = 3

const PARTY_MENU = 10
const BAG_MENU = 11


export default class BattleDialog extends Dialog {
    constructor(battleStage) {
        super()
        this.battleStage = battleStage
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
        } else { return }

        if (direction == 'ArrowUp') {
            cursor.y = 0
        } else if (direction == 'ArrowDown') {
            cursor.y = 1
        } else if (direction == 'ArrowLeft') {
            cursor.x = 0
        } else if (direction == 'ArrowRight') {
            cursor.x = 1
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

    back() {
        if (this.stage == INTRO || this.stage == ACTION) {

        } else {
            this.stage = FIGHTING_MENU
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

    endOfMessageHandler() {
        if (this.stage == INTRO) {
            this.stage = FIGHTING_MENU
        }
    }

    chooseFromFightingMenu() {
        const optionIndex = this.fightingMenuCursor.x + this.fightingMenuCursor.y * 2
        const option = this.fightingMenu[optionIndex]

        if (option == 'Fight') {
            this.stage = MOVES_MENU
        } else if (option == "Pokemon") {
            this.battleStage.activateParty()
        } else if (option == "Bag") {
            this.battleStage.activateBag()
        } else if (option == "Run") {
            this.battleStage.end()
        }
    }

    chooseFromMoves() {
        const moveIndex = this.movesCursor.x + this.movesCursor.y * 2
        this.battleStage.battle.startTurn({type:'move',moveIndex:moveIndex})
        if(this.battleStage.battle.foe.pokemon.currHP == 0){
            this.battleStage.end()
        }
    }


    drawComponent(context) {
        if (this.stage == INTRO) {
            createWindowLayer(0, 160 - 48, 240, 48, this.messages[this.messagePhase])(context)
        } else if (this.stage == FIGHTING_MENU) {
            createWindowLayer(0, 160 - 48, 240, 48, this.fightingMenuMessage)(context)
            let cursorIndex = this.fightingMenuCursor.x + this.fightingMenuCursor.y * 2
            drawMenu(this.fightingMenu, cursorIndex, 80, 48, context)
        } else if (this.stage == MOVES_MENU) {
            let cursorIndex = this.movesCursor.x + this.movesCursor.y * 2
            drawMenu(this.fightingPokemon.moves, cursorIndex, 240, 48, context)
        }
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
        this.addMessages([`A wild ${battle.foe.pokemon.name} appeared!`,
            `I choose you! ${this.fightingPokemon.name}!`
        ])

    }
}

function drawMenu(menuObjects, menuCursor, windowWidth, windowHeight, context) {
    createWindowLayer(240 - windowWidth, 160 - windowHeight, windowWidth, windowHeight)(context)
    const cursorStyle = { font: "7px Arial", fill: "#FFF", border: "#F00" }
    let itemStyle

    let menu = []
    if (menuObjects[0].Name) {
        for (let object of menuObjects) {
            menu.push(object.Name)
        }
    } else {
        for (let string of menuObjects) {
            menu.push(string)
        }
    }

    itemStyle = 0 == menuCursor ? cursorStyle : undefined
    createWindowLayer(
        240 - windowWidth,
        160 - windowHeight,
        windowWidth / 2,
        windowHeight / 2,
        menu[0],
        itemStyle)(context)

    itemStyle = 1 == menuCursor ? cursorStyle : undefined
    createWindowLayer(
        240 - windowWidth + windowWidth / 2,
        160 - windowHeight,
        windowWidth / 2,
        windowHeight / 2,
        menu[1],
        itemStyle)(context)

    itemStyle = 2 == menuCursor ? cursorStyle : undefined
    createWindowLayer(
        240 - windowWidth,
        160 - windowHeight + windowHeight / 2,
        windowWidth / 2,
        windowHeight / 2,
        menu[2],
        itemStyle)(context)

    itemStyle = 3 == menuCursor ? cursorStyle : undefined
    createWindowLayer(
        240 - windowWidth + windowWidth / 2,
        160 - windowHeight + windowHeight / 2,
        windowWidth / 2,
        windowHeight / 2,
        menu[3],
        itemStyle)(context)
}