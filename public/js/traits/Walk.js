const Directions = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']
import { Sides, Trait } from '../Entity.js'
import { Vec2 } from '../math.js'


export default class Walk extends Trait {
    constructor() {
        super('walk')
        this.overrideHold = false
        this.stepWidth = 16
        this.walkingSpeed = 70
        this.toGo = 0
        this.vel = new Vec2(0, 0)
        this.startPos = new Vec2(-1, -1)
        this.walkedDistance = 0
        this.halt = false
        this.direction = false
        this.queue = []
    }

    hold() {
        this.overrideHold = true
    }

    resume() {
        this.overrideHold = false
    }

    move(entity, x, y) {
        this.toGo = 0
        this.walkedDistance = 0
        this.startPos.set(x, y)
        entity.pos.set(x, y)
    }

    start() {
        this.direction = this.queue[0]
        this.halt = false

        if (this.direction == 'ArrowRight') {
            this.vel.set(this.walkingSpeed, 0)
        } else if (this.direction == 'ArrowLeft') {
            this.vel.set(-this.walkingSpeed, 0)
        } else if (this.direction == 'ArrowDown') {
            this.vel.set(0, this.walkingSpeed)
        } else if (this.direction == 'ArrowUp') {
            this.vel.set(0, -this.walkingSpeed)
        } else {
            this.vel.set(0, 0)
        }
    }

    enqueue(direction) {
        let index = this.queue.indexOf(direction)
        if (index >= 0)
            return
        this.queue.unshift(direction)

    }

    cancel(direction) {
        let popIndex = this.queue.indexOf(direction)
        if (popIndex >= 0) {
            this.queue.splice(popIndex, 1)
        }

        this.halt = true
    }

    collides(us, them) {
        if (this.vel.x > 0) {
            us.bounds.right = them.bounds.left
        } else if (this.vel.x < 0) {
            us.bounds.left = them.bounds.right
        } else if (this.vel.y < 0) {
            us.bounds.top = them.bounds.bottom
        } else if (this.vel.y > 0) {
            us.bounds.bottom = them.bounds.top
        }
        this.reset()
    }

    reset() {
        this.vel.set(0, 0)
        this.walkedDistance = 0
        this.toGo = 0
        this.halt = false
        this.startPos.set(-1, -1)
    }

    obstruct(entity, side, match) {
        if (side === Sides.TOP) {
            entity.pos.y = match.y2
        } else if (side === Sides.BOTTOM) {
            entity.pos.y = match.y1 - entity.size.y
        } else if (side === Sides.RIGHT) {
            entity.pos.x = match.x1 - entity.size.x
        } else if (side === Sides.LEFT) {
            entity.pos.x = match.x2
        }
        this.toGo = 0
        this.reset()
    }

    update(entity, deltaTime) {
        if (this.overrideHold)
            return

        if (this.startPos.x < 0 && this.startPos.y < 0)
            this.startPos.set(entity.pos.x, entity.pos.y) // set position

        if (this.queue.length > 0 && // queue not empty
            this.direction != this.queue[0] || //we changed direction
            (this.queue.length == 1 && this.toGo == 0) // the only command
        ) {
            if (!this.halt && this.toGo > 0) { //finish last movement
                this.halt = true
            }
            if (this.toGo == 0)
                this.start()
        }

        this.walkedDistance += this.vel.distance(deltaTime)

        if (!this.halt && this.walkedDistance > this.toGo) { //extend target pos
            this.toGo += this.stepWidth
        }
        if (this.halt) { //continue until target pos
            if (this.toGo - this.walkedDistance > 0) { // ok to move normally
                entity.pos.x += this.vel.distanceX(deltaTime)
                entity.pos.y += this.vel.distanceY(deltaTime)
            } else {
                if (this.direction == 'ArrowRight' || this.direction == 'ArrowLeft') {
                    entity.pos.x = this.startPos.x + this.toGo * Math.sign(this.vel.x)
                } else if (this.direction == 'ArrowUp' || this.direction == 'ArrowDown') {
                    entity.pos.y = this.startPos.y + this.toGo * Math.sign(this.vel.y)
                }
                this.reset()
            }
        } else { //move according to speed
            entity.pos.x += this.vel.distanceX(deltaTime)
            entity.pos.y += this.vel.distanceY(deltaTime)
        }

        entity.vel = this.vel // set vel
        if (entity.vel.x > 0) { //determine heading
            entity.heading = Sides.RIGHT
        } else if (entity.vel.x < 0) {
            entity.heading = Sides.LEFT
        } else if (entity.vel.y < 0) {
            entity.heading = Sides.TOP
        } else if (entity.vel.y > 0) {
            entity.heading = Sides.BOTTOM
        }
    }
}