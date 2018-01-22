import Game from './Game.js'
import { createLocationLoader } from './loaders/location.js'
import { indexLogger } from './debug.js'
import { loadEntities } from './entities.js'
import { setupGameKeyboard } from './input.js'
import { loadPokemon } from './loaders/pokemon.js'


async function main(canvas) {
    var context = canvas.getContext('2d')
    const game = new Game()

    const entityFactory = await loadEntities()
    const loadLocation = await createLocationLoader(entityFactory, game.dataBase)
    const location = await loadLocation('littleroot-town')
    // const location = await loadLocation('101')
    game.loadComponents()
        .then(() => {
            loadPokemon(150, 70, game.dataBase.moves, game.dataBase.typeTable).then(pokemon => {
                pokemon.currHP = 100
                brendan.party.addPokemon(pokemon)
            })
            loadPokemon(134, 60, game.dataBase.moves, game.dataBase.typeTable).then(pokemon => {
                brendan.party.addPokemon(pokemon)
            })
            loadPokemon(500, 70, game.dataBase.moves, game.dataBase.typeTable).then(pokemon => {
                brendan.party.addPokemon(pokemon)
            })
            loadPokemon(400, 70, game.dataBase.moves, game.dataBase.typeTable).then(pokemon => {
                pokemon.currHP = 10
                brendan.party.addPokemon(pokemon)
            })
        })
    game.location = location

    const brendan = entityFactory.brendan()
    game.setPlayer(brendan)
    brendan.pos.set(96, 176)


    // brendan.pos.set(96, 48)
    window.game = game

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