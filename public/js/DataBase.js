import { loadPokemon } from './loaders/pokemon.js'
import { loadMoves } from './loaders/moves.js'

export default class DataBase {
    constructor() {
        this.items = new Map()
        this.pokemons = new Map()
        this.entities = new Map()
        this.moves = new Map()
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

    loadMoves(){
        return loadMoves().then(moves=>{
            for(let move of moves){
                this.moves.set(move.InternalName,move)
            }
        })
    }

}