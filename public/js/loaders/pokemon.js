import Pokemon from '../Pokemon.js'
import {loadJSON , loadImage} from './spriteSheet.js'

function pad(num, size=3) {
    var s = "0000" + num;
    return s.substr(s.length-size);
}

export function loadPokemon(id,level,databaseMoves) {
    return Promise.all([
            loadJSON(`/Pokemons/${id}.json`),
            loadImage(`/img/pokemon/Battlers/${pad(id)}.png`),
            loadImage(`/img/pokemon/Battlers/${pad(id)}b.png`),
            loadImage(`/img/pokemon/Battlers/icon${pad(id)}.png`)
        ])
        .then(([pokemonSpec, frontImage, backImage, iconImage]) => {
            const pokemon = new Pokemon(id)
            pokemon.specs = pokemonSpec
            pokemon.front = frontImage
            pokemon.back = backImage
            pokemon.icon = iconImage
            if(level && databaseMoves){
                pokemon.setLevel(level,databaseMoves)
            }
            return pokemon
        })
}
