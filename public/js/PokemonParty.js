export default class PokemonParty {
    constructor() {
        this.pokemons = []
        this.fightingPokemon = 0
    }

    getFightingPokemon(){
        return this.pokemons[this.fightingPokemon]
    }

    addPokemon(pokemon) {
        if (this.pokemons.length < 6) {
            this.pokemons.push(pokemon)
        }
        else{
            console.warn('party is full')
        }
    }
}