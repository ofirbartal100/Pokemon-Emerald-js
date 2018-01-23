import { createPartyPokemonLayer } from './partyPokemon.js'
import { createWindowLayer } from './window.js'

export function createPartyPageLayer(deltaTime, party, graphics) {
    const buffer = document.createElement('canvas')
    buffer.width = 240
    buffer.height = 160

    const context = buffer.getContext('2d')
    const partyBackground = graphics[0]
    const cancelBtn = graphics[3]
    const cancelBtnSelected = graphics[6]

    return function drawPartyPageLayer(canvasContext) { //watch out for this!! references the calling object

        context.drawImage(partyBackground, 0, 0, 240, 160)

        let selected = this.partyCursor.x + this.partyCursor.y * 2
        for (let i = 0; i < 6; i++) {
            createPartyPokemonLayer(deltaTime, i, this.party.pokemons[i], this.graphics, (selected == i))(context)
        }

        if (this.stage == 0) {
            if (this.partyCursor.y == Math.min(4, this.party.pokemons.length / 2 + 1) - 1)
                context.drawImage(cancelBtnSelected, 205, 145, 35, 15)
            else
                context.drawImage(cancelBtn, 205, 145, 35, 15)

            context.fillStyle = "#FFF";
            context.fillText('Cancel', 205 + 1, 145 + 10)

            createWindowLayer(0, 135, 200, 25, "Choose a Pokemon.")(context)
        } else if (this.stage == 1) {
            createWindowLayer(0, 135, 180, 25, `What To Do With ${this.chosenPokemon.name} ?`)(context)
            this.partyMenuCursor = (this.partyMenuCursor + this.pokemonMenu.length) % this.pokemonMenu.length
            drawMenuRaise(this.pokemonMenu, this.partyMenuCursor, 190, 160, 50, 20, context)
        }

        canvasContext.drawImage(buffer, 0, 0)
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