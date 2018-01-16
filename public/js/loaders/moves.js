import Move from '../Move.js'
import { loadJSON } from './spriteSheet.js'


export function loadMoves() {
    return loadJSON(`/pokemon/moves.json`)
        .then(movesSpec => {
            return movesSpec
        })
}