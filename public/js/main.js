import Game from './Game.js'
import { createLocationLoader } from './loaders/location.js'
import { indexLogger } from './debug.js'
import { loadEntities } from './entities.js'
import { setupGameKeyboard } from './input.js'
import { loadPokemon } from './loaders/pokemon.js'


async function main(canvas) {
    var context = canvas.getContext('2d')

    const entityFactory = await loadEntities()
    const loadLocation = await createLocationLoader(entityFactory)
    // const location = await loadLocation('littleroot-town')
    const location = await loadLocation('101')

    const game = new Game()
    game.location = location

    const brendan = entityFactory.brendan()
    game.setPlayer(brendan)
    brendan.pos.set(96, 176)
    loadPokemon(150, 70).then(pokemon => {
        brendan.party.addPokemon(pokemon)
    })

    // brendan.pos.set(96, 48)

    setupGameKeyboard(game)
    indexLogger(canvas, game.camera)

    game.timer.update = function update(deltaTime) {

        game.update(deltaTime)
        game.draw(context)
    }

    game.timer.start()

}

var canvas = document.getElementById('screen')
main(canvas)