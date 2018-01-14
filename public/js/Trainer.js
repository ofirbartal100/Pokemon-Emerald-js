import Entity from './Entity.js'
import PokemonParty from './PokemonParty.js'

export default class Trainer extends Entity {
    constructor() {
        super()
        this.role = 'Trainer'
        this.party = new PokemonParty()
    }
}