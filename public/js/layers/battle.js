const FOE = 0
const OWN = 1

export function createBattleLayer(battle, graphics) {
    const buffer = document.createElement('canvas')
    buffer.width = 240
    buffer.height = 160
    const size = 64
    const rightMargin = 30
    const topMargin = 15
    const context = buffer.getContext('2d')
    context.font = "10px Arial";



    return function drawBattleLayer(canvasContext) {
        // if (battle.foe.pokemon && battle.details) {
        if (battle.foe.pokemon) {
            context.clearRect(0, 0, buffer.width, buffer.height)
            context.fillRect(0, 0, buffer.width, buffer.height)
            //background
            if (battle.arena)
                context.drawImage(battle.arena, 0, 0)

            //trainers

            //pokemons
            context.drawImage(battle.foe.pokemon.front, 240 - size - rightMargin, topMargin, size, size)
            context.drawImage(battle.player.party.pokemons[battle.player.party.fightingPokemon].back, rightMargin, 112 - size, size, size)

            //details

            // context.drawImage(databoxNormalFoe, 0, 8, 120, 30)
            // context.drawImage(databoxNormal, 120, 70, 120, 40)

            drawDatabox(battle, FOE, graphics, context)
            drawDatabox(battle, OWN, graphics, context)

            // drawDatabox(battle, FOE, 0, 8, context)
            // drawDatabox(battle, OWN, 240 - 70, 160 - 38 - 48, context)

            //battleDialog
            if (battle.dialog.stage == -1) {
                battle.dialog.loadBattle(battle)
            }
            battle.dialog.drawComponent(context)

            canvasContext.drawImage(buffer, 0, 0)
        }
    }
}

function drawDatabox(battle, poi, graphics, context) {
    const databoxNormal = graphics[51]
    const databoxNormalFoe = graphics[52]
    const hpLife = graphics[73]
    const lvl = graphics[75]
    const exp = graphics[71]

    context.font = "8px Arial"



    //data
    let hpPrcnt, hpX, hpY, hpW, hpH
    let HP, currHP
    let expPrcnt, expX, expY, expW, expH
    let lvlX, lvlY
    let nameOffset = 4
    let pkmName
    let pkmLevel
    let pkmGender
    let x, y
    let container
    let factor = 0.5


    if (poi == OWN) {
        const own = battle.player.party.getFightingPokemon()
        pkmName = own.name
        pkmLevel = own.level
        pkmGender = own.gender
        x = 120
        y = 70
        HP = own.HP
        currHP = own.currHP
        hpPrcnt = own.currHP / own.HP
        hpX = (136 / 260)
        hpY = (40 / 85)
        hpW = ((232 - 136) / 260)
        hpH = ((46 - 40) / 85)

        expPrcnt = own.levelEXP / own.levelUpEXP
        expX = (40 / 260)
        expY = (76 / 85)
        expW = ((232 - 40) / 260)
        expH = ((80 - 76) / 85)
        nameOffset = 20
        container = databoxNormal
    } else if (poi == FOE) {
        const foe = battle.foe.pokemon
        hpPrcnt = foe.currHP / foe.HP
        pkmName = foe.name
        pkmLevel = foe.level
        pkmGender = foe.gender
        x = 0
        y = 8
        hpX = (118 / 260)
        hpY = (40 / 62)
        hpW = ((214 - 118) / 260)
        hpH = ((46 - 40) / 62)
        container = databoxNormalFoe
    }

    lvlX = x + (hpX + hpW / 2) * container.width * factor
    lvlY = y + hpY * container.height * factor - lvl.height

    //container
    context.drawImage(container, x, y, container.width * factor, container.height * factor)

    //hp
    let hpCond = 0
    if (hpPrcnt < 0.5 && hpPrcnt >= 0.2) {
        hpCond = 1
    } else if (hpPrcnt < 0.2) {
        hpCond = 2
    }
    context.drawImage(hpLife,
        0, hpCond * hpLife.height / 3,
        hpLife.width, hpLife.height / 3,
        x + (hpX * container.width) * factor,
        y + (hpY * container.height) * factor,
        (hpW * container.width * hpPrcnt) * factor,
        (hpH * container.height) * factor)



    if (poi == OWN) {

        //hp
        context.fillStyle = "#000";
        context.fillText(Math.floor(currHP) + '/' + HP, x +((134 / 260) * container.width) * factor, y + ((55 / 85) * container.height) * factor + 6)

        //exp
        context.drawImage(exp,
            x + (expX * container.width) * factor,
            y + (expY * container.height) * factor,
            (expW * container.width * expPrcnt) * factor,
            (expH * container.height) * factor)
    }

    //name
    context.fillStyle = "#000";
    context.fillText(pkmName, x + nameOffset, y + 14)

    //level
    context.fillStyle = "#000";
    context.drawImage(lvl, lvlX, lvlY, lvl.width * factor, lvl.height * factor)
    context.fillText(pkmLevel, lvlX + lvl.width * factor, lvlY + 8)


    //gender
    if (pkmGender == 'Male') {
        context.fillStyle = '#00F'
        context.fillRect(x + 10, y + 30, 3, 3)
    } else if (pkmGender == 'Female') {
        context.fillStyle = '#F00'
        context.fillRect(x + 10, y + 30, 3, 3)
    }
}