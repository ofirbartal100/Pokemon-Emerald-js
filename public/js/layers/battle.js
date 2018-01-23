const FOE = 0
const OWN = 1

export function createBattleLayer(battle, details) {
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
            // context.drawImage(battle.details.databox_foe , )
            drawDatabox(battle, FOE, 0, 8, context)
            drawDatabox(battle, OWN, 240 - 70, 160 - 38 - 48, context)

            //battleDialog
            if (battle.dialog.stage == -1) {
                battle.dialog.loadBattle(battle)
            }
            battle.dialog.drawComponent(context)

            canvasContext.drawImage(buffer, 0, 0)
        }
    }
}

function drawDatabox(battle, poi, x, y, context) {
    const width = 70
    const height = 40
    const hpWidth = 50
    const hpHeight = 5
    const hpX = x + 10
    const hpY = y + 15
    context.font = "6px Arial"
    //container
    context.fillStyle = '#884'
    context.fillRect(x, y, width, height)

    context.strokeStyle = '#000'
    context.strokeRect(x, y, width, height)

    //hp bar
    let hpPrcnt
    let pkmName
    let pkmLevel
    let pkmGender
    if (poi == OWN) {
        const own = battle.player.party.getFightingPokemon()
        hpPrcnt = own.currHP / own.HP
        pkmName = own.name
        pkmLevel = own.level
        pkmGender = own.gender
    } else if (poi == FOE) {
        const foe = battle.foe.pokemon
        hpPrcnt = foe.currHP / foe.HP
        pkmName = foe.name
        pkmLevel = foe.level
        pkmGender = foe.gender
    }
    context.fillStyle = '#000'
    context.fillRect(hpX, hpY, hpWidth, hpHeight)


    if (hpPrcnt > 0.5) {
        context.fillStyle = '#0F0'
    } else if (hpPrcnt >= 0.2) {
        context.fillStyle = '#FF4'
    } else {
        context.fillStyle = '#F00'
    }
    context.fillRect(hpX, hpY, hpWidth * hpPrcnt, hpHeight)


    //name
    context.fillStyle = "#000";
    context.fillText(pkmName, x + 2, y + 8)

    //level
    context.fillStyle = "#000";
    context.fillText('Lv' + pkmLevel, x + 40, y + 8)

    //gender
    if (pkmGender == 'Male') {
        context.fillStyle = '#00F'
        context.fillRect(x + 10, y + 30, 3, 3)
    } else if (pkmGender == 'Female') {
        context.fillStyle = '#F00'
        context.fillRect(x + 10, y + 30, 3, 3)
    }
}