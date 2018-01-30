import Battle from './Battle.js'
import Pokemon from '../Pokemon.js'

export default class WildBattle extends Battle {
    constructor(arena, player, pokemonID, level) {
        super(arena, player)
        this.type = 'single'
        this.foe = {
            type: 'wildSingle',
            id: pokemonID,
            level: level
        }
    }

    init(battleStage) {
        super.init()
        this.dialog.battleStage = battleStage
        let foePokemon = battleStage.getPokemon(this.foe.id)
        this.foe.pokemon = Object.assign(new Pokemon, foePokemon)
        this.foe.pokemon.setLevel(this.foe.level, battleStage.battleData.moves, battleStage.battleData.typeTable)
    }

    end() {
        this.player.inBattle = false
    }
}