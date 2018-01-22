export function createPartyPokemonLayer(deltaTime, index, pokemon, graphics, selected) {
    const buffer = document.createElement('canvas')
    buffer.width = 120
    buffer.height = 40
    const x = index % 2
    const y = index / 2 - x * 13 / buffer.height
    const context = buffer.getContext('2d')
    context.font = 'Ariel 7px black'
    const slotSelected = graphics[18]
    const slot = graphics[15]
    const hpBar = graphics[10]
    const hpLife = graphics[9]
    const slotEmpty = graphics[14]


    return function drawPartyPokemonLayer(canvasContext) {
        context.clearRect(0, 0, buffer.width, buffer.height)
        if (pokemon) {
            if (selected)
                context.drawImage(slotSelected, 0, 0, buffer.width, buffer.height) //slot
            else
                context.drawImage(slot, 0, 0, buffer.width, buffer.height) //slot
            
            //animate
            let iconXCropOffset = 0
            pokemon.iconAnimateTime += deltaTime
            if(pokemon.iconAnimateTime > 0.25 && pokemon.iconAnimateTime < 0.5)
                iconXCropOffset = 64
            else if(pokemon.iconAnimateTime >= 0.5)
                pokemon.iconAnimateTime = 0

            context.drawImage(pokemon.icon, iconXCropOffset, 0, 64, 64, 0, 0, 32, 32)

            context.fillText(pokemon.name, 35, 14)

            context.drawImage(hpBar, 32, 20, 80, 7) //hpbar


            let hpPrcnt = pokemon.currHP / pokemon.HP
            let hpCond = 0
            if (hpPrcnt < 0.5 && hpPrcnt >= 0.2) {
                hpCond = 1
            } else if (hpPrcnt < 0.2) {
                hpCond = 2
            }
            context.drawImage(hpLife, 0, hpCond * 8, 55 * hpPrcnt, 8, 32 + 17, 20 + 1, 60 * hpPrcnt, 4) //hplife
        } else {
            context.drawImage(slotEmpty, 0, 0, buffer.width, buffer.height) //slotEmpty
        }

        canvasContext.drawImage(buffer, x * buffer.width, y * buffer.height)
    }
}