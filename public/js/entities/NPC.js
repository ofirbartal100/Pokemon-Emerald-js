import Entity, { Sides } from '../Entity.js'
import RandomWalk from '../traits/RandomWalk.js'
import { Vec2 } from '../math.js'
import { loadSpriteSheet } from '../loaders/spriteSheet.js'

export function loadNPC(name) {
    return loadSpriteSheet(name)
        .then(sprite => { return createNPCFactory(name, sprite) })
}


function createNPCFactory(name, sprite) {
    return function createNPC() {
        return new NPC(name, sprite)
    }
}

export default class NPC extends Entity {

    constructor(name, sprite) {
        super()
        this.name = name
        this.size.set(16, 16)
        this.addTrait(new RandomWalk())
        this.offset = new Vec2(1, -5)
        this.sprite = sprite
        this.heading = Sides.BOTTOM
        this.role = 'NPC'
    }

    draw(context) {
        const frame = routeAnime(this)
        if (frame) { //moving
            let frameOffset = this.sprite.drawAnime(frame, context, 0, 0, this.randomWalk.walkedDistance, this.vel.x > 0)
            this.offset.set(...frameOffset)
        } else { //standing
            if (this.heading === Sides.RIGHT) {
                this.sprite.draw('looking-left', context, 0, 0, true)
            } else if (this.heading === Sides.LEFT) {
                this.sprite.draw('looking-left', context, 0, 0)
            } else if (this.heading === Sides.TOP) {
                this.sprite.draw('looking-up', context, 0, 0)
            } else if (this.heading === Sides.BOTTOM) {
                this.sprite.draw('looking-down', context, 0, 0)
            }
        }
    }
}

function routeAnime(npc) {
    if (npc.vel.y > 0) {
        return 'walk-down'
    } else if (npc.vel.y < 0) {
        return 'walk-up'
    } else if (npc.vel.x != 0) {
        return 'walk-left'
    }
    return false
}