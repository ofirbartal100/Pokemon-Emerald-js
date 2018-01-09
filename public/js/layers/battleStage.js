export function createBattleStageLayer(battle, dialog) {
    const buffer = document.createElement('canvas')
    buffer.width = 240
    buffer.height = 160
    const size = 64
    const rightMargin = 30
    const topMargin = 15
    const context = buffer.getContext('2d')
    context.font = "10px Arial";


    return function drawBattleStageLayer(canvasContext) {
        context.clearRect(0, 0, buffer.width, buffer.height)
        context.fillRect(0, 0, buffer.width, buffer.height)
        //background
        if (battle.arena)
            context.drawImage(battle.arena, 0, 0)

        //trainers

        //pokemons
        if (battle.pokemon) {
            // context.fillRect(240 - size - rightMargin, topMargin, size, size)
            context.drawImage(battle.pokemon.front, 240 - size - rightMargin, topMargin, size, size)
            context.drawImage(battle.player.party.pokemons[0].back, rightMargin, 112 - size, size, size)
        }
        //details

        //dialog
        if (battle.pokemon) {
            if(dialog.phase < 0){
                dialog.loadBattle(battle)
            }
            dialog.drawComponent(context)
        }

        canvasContext.drawImage(buffer, 0, 0)
    }
}