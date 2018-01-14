import { loadPokemon } from './loaders/pokemon.js'

export function loadPokemons(IDs) {
    const pokemonFactories = {}

    const loaders = []
    IDs.forEach(id => {
        loaders.push(loadPokmon(id).then(addAs(`pokemon_${id}`)))
    })

    function addAs(pokemon_id) {
        return factory => pokemonFactories[pokemon_id] = factory
    }

    return Promise.all([
        ...loaders
    ]).then(() => pokemonFactories)
}