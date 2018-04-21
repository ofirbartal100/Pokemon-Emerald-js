import { createPartyPokemonLayer } from './partyPokemon.js'
import { createWindowLayer } from './window.js'
import { createSummeryLayer } from './summery.js'

export function createPartyPageLayer(deltaTime, partyPage) {
    const buffer = document.createElement('canvas')
    buffer.width = 240
    buffer.height = 160

    let graphics = partyPage.graphics
    const context = buffer.getContext('2d')
    const partyBackground = graphics[0]

    return function drawPartyPageLayer(canvasContext) { //watch out for this!! references the calling object
        //background
        context.drawImage(partyBackground, 0, 0, 240, 160)

        //draw pokemon slots
        drawPokemonSlots(partyPage, deltaTime, context)

        //draw dialog windows
        drawDialogWindows(partyPage, context)

        if(partyPage.controller.stage == 3){
            drawSummery(partyPage, context)
        }

        canvasContext.drawImage(buffer, 0, 0)
    }
}

function drawPokemonSlots(partyPage, deltaTime, context) {
    let selected = partyPage.controller.getSelectedIndex().pokemon
    for (let i = 0; i < 6; i++) {
        createPartyPokemonLayer(deltaTime, i, partyPage.party.pokemons[i], partyPage.graphics, (selected == i))(context)
    }
}

function drawDialogWindows(partyPage, context) {
    let graphics = partyPage.graphics
    const cancelBtn = graphics[3]
    const cancelBtnSelected = graphics[6]
    const DEFAULT = 0
    const INFO = 1
    const SWITCH_POKEMON = 2

    if (partyPage.controller.stage == DEFAULT || partyPage.controller.stage == SWITCH_POKEMON) {
        if (partyPage.controller.partyCursor.y == Math.min(4, partyPage.party.pokemons.length / 2 + 1) - 1) {
            context.drawImage(cancelBtnSelected, 205, 145, 35, 15)
        } else {
            context.drawImage(cancelBtn, 205, 145, 35, 15)
        }

        context.fillStyle = "#FFF";
        context.fillText('Cancel', 205 + 1, 145 + 10)

        createWindowLayer(0, 135, 200, 25, partyPage.dialogPhrase)(context)
    } else if (partyPage.controller.stage == INFO) {
        drawMenuRaise(partyPage.pokemonMenu, partyPage.controller.getSelectedIndex().menu, 190, 160, 50, 20, context)
        
        createWindowLayer(0, 135, 180, 25, partyPage.dialogPhrase)(context)
    }
}

function drawMenuRaise(menuObjects, menuCursor, x, y, itemWidth, itemHeight, context) {
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

    for (let i = 0; i < menu.length; i++) {
        itemStyle = menu.length - 1 - i == menuCursor ? cursorStyle : undefined
        createWindowLayer(
            x,
            y - (i + 1) * itemHeight,
            itemWidth,
            itemHeight,
            menu[menu.length - 1 - i],
            itemStyle)(context)
    }
}

function drawSummery(partyPage, context){
    let pokemonIndex = partyPage.controller.partyCursor.y * 2 + partyPage.controller.partyCursor.x
    let summeryIndex = partyPage.controller.summeryCursor
    createSummeryLayer(partyPage.party.pokemons[pokemonIndex],partyPage.graphics)(context,summeryIndex)
}