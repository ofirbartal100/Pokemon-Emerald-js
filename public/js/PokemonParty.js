export default class PokemonParty {
    constructor() {
        this.pokemons = []
        this.fightingPokemon = 0
    }

    getFightingPokemon() {
        return this.pokemons[this.fightingPokemon]
    }

    addPokemon(pokemon) {
        if (this.pokemons.length < 6) {
            this.pokemons.push(pokemon)
        } else {
            console.warn('party is full')
        }
    }

    switch (a, b) {
        if (a < this.pokemons.length && b < this.pokemons.length) {
            let temp = this.pokemons[a]
            this.pokemons[a] = this.pokemons[b]
            this.pokemons[b] = temp
        }
    }
}