import Pokemon  from '../Pokemon.js'
import { loadPokemon } from '../loaders/pokemon.js'
import { loadImage } from '../loaders/spriteSheet.js'

export default class WildBattle {
    constructor(arena, pokemonID, level, player) {
        this.player = player
        loadImage(`/img/battle-arenas/${arena}.png`).then(arenaImg => {
            this.arena = arenaImg
        })
        
        this.pokemonLevel = level
        this.pokemonID = pokemonID
    }

    init(pokemon){
        this.pokemon = Object.assign(new Pokemon, pokemon)
        this.pokemon.setLevel(this.pokemonLevel)
    }

    end(){
    	this.player.inBattle = false
    }
}