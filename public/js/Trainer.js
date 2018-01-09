import Entity from './Entity.js'
import Party from './Party.js'

export default class Trainer extends Entity {
    constructor() {
        super()
        this.role = 'Trainer'
        this.party = new Party()
    }
}