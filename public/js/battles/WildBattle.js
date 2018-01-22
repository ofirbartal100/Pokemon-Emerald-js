import Battle from './Battle.js'
import Pokemon from '../Pokemon.js'

export default class WildBattle extends Battle {
    constructor(arena, player, pokemonID, level) {
        super(arena, player)

        this.foe = {
            type: 'wildSingle',
            id: pokemonID,
            level: level
        }
    }

    init(getPokemon, moves, typeTable) {
        let foePokemon = getPokemon(this.foe.id)
        this.foe.pokemon = Object.assign(new Pokemon, foePokemon)
        this.foe.pokemon.setLevel(this.foe.level, moves, typeTable)
    }

    end() {
        this.player.inBattle = false
    }
}