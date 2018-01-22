import { loadPokemon } from './loaders/pokemon.js'

export default class DataBase {
    constructor() {
        this.items = new Map()
        this.pokemons = new Map()
        this.entities = new Map()
        this.areas = new Map()
        this.moves = new Map()
        this.typeTable = new Map()
    }

    setPokemon(id) {
        if (this.pokemons.has(id)) {
            return
        }
        
        loadPokemon(id).then(pokemon => {
            this.pokemons.set(id, pokemon)
        })
    }

    getPokemon(id) {
        return this.pokemons.get(id)
    }

    add(item,data){
        if(item == 'pokemon'){
            this.setPokemon(data)
        }
    }

}