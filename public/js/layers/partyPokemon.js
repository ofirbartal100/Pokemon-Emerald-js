export function createPartyPokemonLayer(index, pokemon, graphics) {
    const buffer = document.createElement('canvas')
    buffer.width = 120
    buffer.height = 40
    const x = index % 2
    const y = index / 2 - x * 13 / buffer.height
    const context = buffer.getContext('2d')
    context.font = 'Ariel 7px black'


    return function drawPartyPokemonLayer(canvasContext) {
        context.clearRect(0, 0, buffer.width, buffer.height)
        if (pokemon) {
            context.drawImage(graphics[15], 0, 0, buffer.width, buffer.height) //slot
            //to animate
            context.drawImage(pokemon.icon, 0, 0, 64, 64, 0, 0, 32, 32)

            context.fillText(pokemon.name, 35, 14)

            context.drawImage(graphics[10], 32, 20, 80, 7) //hpbar


            let hpPrcnt = pokemon.currHP / pokemon.HP
            let hpCond = 0
            if (hpPrcnt < 0.5 && hpPrcnt >= 0.2) {
                hpCond = 1
            } else if (hpPrcnt < 0.2) {
                hpCond = 2
            }
            context.drawImage(graphics[9], 0, hpCond * 8, 55 * hpPrcnt, 8, 32 + 17, 20 + 1, 60 * hpPrcnt, 4) //hplife
        } else {
            context.drawImage(graphics[14], 0, 0, buffer.width, buffer.height) //slotEmpty
        }



        canvasContext.drawImage(buffer, x * buffer.width, y * buffer.height)
    }
}