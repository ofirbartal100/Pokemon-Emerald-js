export default class Party {
    constructor() {
        this.pokemons = []
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