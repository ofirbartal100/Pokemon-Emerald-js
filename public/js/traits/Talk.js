import { Sides, Trait } from '../Entity.js'
import { Vec2 } from '../math.js'
import { Commands } from '../input.js'

export default class Talk extends Trait {
    constructor() {
        super('talk')
        this.poi = undefined
        this.collidePos = new Vec2(0, 0)
        this.collideHeading = undefined
        this.collidePosPOI = new Vec2(0, 0)
        this.talking = false
        this.phase = 0
    }

    ready(entity) {
        if (this.poi) {
            if (entity.heading == this.collideHeading &&
                entity.pos.toIndex()[0] == this.collidePos.toIndex()[0] &&
                entity.pos.toIndex()[1] == this.collidePos.toIndex()[1] &&
                this.poi.pos.toIndex()[0] == this.collidePosPOI.toIndex()[0] &&
                this.poi.pos.toIndex()[1] == this.collidePosPOI.toIndex()[1]) {
                return true
            } else {
                this.poi = undefined
            }
        }

        return false
    }

    interact(entity, command, state, game) {
        if ((command == Commands[0] || command == Commands[1]) && state && this.commandState != state) {
            if (!this.talking && this.ready(entity))
                this.start(entity, game)
            if (this.talking)
                this.next(entity)
        }
        this.commandState = state
    }

    start(entity, game) {
        this.dialog = game.dialog
        this.dialog.initMessages(-1)
        this.dialog.addMessages(this.poi.messages)
        this.talking = true
        this.poi.heading = oppositeHeading(this.collideHeading)
        entity.hold()
        this.poi.hold()
    }

    next(entity) {

        this.dialog.nextMessage()
        if (!this.dialog.active) {
            this.finish(entity)
        }
    }

    collides(us, them) { //have to collide...
        if (this.poi) {
            return
        }
        this.collidePos.set(us.pos.x, us.pos.y)
        this.collideHeading = us.heading
        this.collidePosPOI.set(them.pos.x, them.pos.y)
        this.poi = them
    }


    finish(entity) {
        this.talking = false
        this.poi.resume()
        entity.resume()
        this.phase = 0
    }


    update(entity, deltaTime) {
        this.ready(entity)
    }
}

function oppositeHeading(heading) {
    if (heading == Sides.TOP) {
        return Sides.BOTTOM
    } else if (heading == Sides.RIGHT) {
        return Sides.LEFT
    } else if (heading == Sides.LEFT) {
        return Sides.RIGHT
    } else if (heading == Sides.BOTTOM) {
        return Sides.TOP
    }
}