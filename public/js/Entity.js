import { Vec2 } from './math.js'
import BoundingBox from './BoundingBox.js'

export const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
    LEFT: Symbol('left'),
    RIGHT: Symbol('right'),
};

export class Trait {
    constructor(name) {
        this.NAME = name
    }

    obstruct() {

    }

    move() {

    }

    collides() {

    }

    hold() {

    }

    resume() {

    }

    interact(entity, command, state, game) {

    }

    update() {

    }
}


export default class Entity {
    constructor() {
        this.pos = new Vec2(0, 0)
        this.vel = new Vec2(0, 0)
        this.size = new Vec2(0, 0)
        this.offset = new Vec2(0, 0)
        this.bounds = new BoundingBox(this.pos, this.size, this.offset)
        this.lifetime = 0
        this.heading = Sides.DOWN
        this.traits = []
        this.role
    }


    addTrait(trait) {
        this.traits.push(trait)
        this[trait.NAME] = trait
    }

    obstruct(side, match) {
        this.traits.forEach(trait => {
            trait.obstruct(this, side, match)
        })
    }

    move(x, y) {
        this.traits.forEach(trait => {
            trait.move(this, x, y)
        })
    }

    collides(canditate) {
        this.traits.forEach(trait => {
            trait.collides(this, canditate)
        })
    }

    hold() {
        this.traits.forEach(trait => {
            trait.hold()
        })
    }

    resume() {
        this.traits.forEach(trait => {
            trait.resume()
        })
    }

    interact(command, state, game) {
        this.traits.forEach(trait => {
            trait.interact(this, command, state, game)
        })
    }

    update(deltaTime) {
        this.traits.forEach(trait => {
            trait.update(this, deltaTime)
        })
        this.lifetime += deltaTime
    }
}