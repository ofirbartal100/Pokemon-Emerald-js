import { loadPokemon } from '../loaders/pokemon.js'
import { loadImage } from '../loaders/spriteSheet.js'

export default class WildBattle {
    constructor(arena, pokemonID, level, player) {
        this.player = player
        loadImage(`/img/battle-arenas/${arena}.png`).then(arenaImg => {
            this.arena = arenaImg
        })
        loadPokemon(pokemonID, level).then(pokemon => {
            this.pokemon = pokemon
        })
    }

}