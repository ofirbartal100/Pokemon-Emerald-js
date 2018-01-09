import Pokemon from '../Pokemon.js'
import {loadJSON , loadImage} from './spriteSheet.js'

function pad(num, size=3) {
    var s = "0000" + num;
    return s.substr(s.length-size);
}

export function loadPokemon(id,level) {
    return Promise.all([
            loadJSON(`/Pokemons/${id}.json`),
            loadImage(`/img/pokemon/Battlers/${pad(id)}.png`),
            loadImage(`/img/pokemon/Battlers/${pad(id)}b.png`)           
        ])
        .then(([pokemonSpec, frontImage, backImage]) => {
            // .then(pokemonSpec =>{
            const pokemon = new Pokemon(id,level)
            pokemon.load(pokemonSpec)
            pokemon.front = frontImage
            pokemon.back = backImage
            return pokemon
        })
}
