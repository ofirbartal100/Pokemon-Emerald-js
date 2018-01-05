import Entity , {Sides} from '../Entity.js'
import Walk from '../traits/Walk.js'
import Talk from '../traits/Talk.js'
import { Vec2 } from '../math.js'
import { loadSpriteSheet } from '../loaders/spriteSheet.js'

export function loadBrendan() {
    return loadSpriteSheet('brendan')
        .then(createBrendanFactory)
}


function createBrendanFactory(sprite) {

    function routeAnime(brendan) {
        if (brendan.vel.y > 0) {
            return 'walk-down'
        } else if (brendan.vel.y < 0) {
            return 'walk-up'
        } else if (brendan.vel.x != 0) {
            return 'walk-left'
        }
        return false
    }

    function drawBrendan(context) {
        const frame = routeAnime(this)
        if (frame) { //moving
            let frameOffset = sprite.drawAnime(frame, context, 0, 0, this.walk.walkedDistance, this.vel.x > 0)
            this.offset.set(...frameOffset)
        } else { //standing
            if (this.heading ===  Sides.RIGHT) {
                sprite.draw('looking-left', context, 0, 0, true)
            } else if (this.heading ===  Sides.LEFT) {
                sprite.draw('looking-left', context, 0, 0)
            } else if (this.heading ===  Sides.TOP) {
                sprite.draw('looking-up', context, 0, 0)
            } else if (this.heading ===  Sides.BOTTOM) {
                sprite.draw('looking-down', context, 0, 0)
            }
        }
    }


    return function createBrendan() {
        const brendan = new Entity()
        brendan.size.set(16, 16)
        brendan.heading = Sides.BOTTOM
        brendan.addTrait(new Walk())
        brendan.addTrait(new Talk())
        brendan.offset = new Vec2(1, -5)
        brendan.draw = drawBrendan
        brendan.role = 'Player'

        return brendan
    }
}