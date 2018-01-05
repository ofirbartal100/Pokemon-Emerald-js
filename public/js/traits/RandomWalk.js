const Directions = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']
const RIGHT = 39
const LEFT = 37
const UP = 38
const DOWN = 40
import { Trait, Sides } from '../Entity.js'
import { Vec2 } from '../math.js'


export default class RandomWalk extends Trait {
    constructor() {
        super('randomWalk')
        this.overrideHold = false
        this.stepWidth = 16
        this.walkingSpeed = 50
        this.toGo = 0
        this.vel = new Vec2(0, 0)
        this.startPos = new Vec2(-1, -1)
        this.walkedDistance = 0
        this.halt = false
        this.direction = false
        this.movePrecent = 1
        this.distanceFromStart = new Vec2(0, 0)
        this.maxDistanceFromStart = new Vec2(40, 40)
        this.queue = []
    }

    hold(){
        this.overrideHold = true
    }

    resume(){
        this.overrideHold = false
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

    reset() {
        this.distanceFromStart.x += this.toGo * Math.sign(this.vel.x)
        this.distanceFromStart.y += this.toGo * Math.sign(this.vel.y)
        this.vel.set(0, 0)
        this.walkedDistance = 0
        this.toGo = 0
        this.halt = false
        this.startPos.set(-1, -1)
    }

    random() {
        let rand = Math.floor(Math.random() * 100)
        if (rand < this.movePrecent) {
            rand = Math.floor(Math.random() * 100)
            let direction = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']
            if (this.distanceFromStart.x > this.maxDistanceFromStart.x) {
                splice(direction, Directions[0])
            } else if (this.distanceFromStart.x < -this.maxDistanceFromStart.x) {
                splice(direction, Directions[1])
            } else if (this.distanceFromStart.y > this.maxDistanceFromStart.y) {
                splice(direction, Directions[3])
            } else if (this.distanceFromStart.y < -this.maxDistanceFromStart.y) {
                splice(direction, Directions[2])
            }
            this.enqueue(direction[rand % 4])

        }

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

    collides(us,them) {
        if (this.toGo > 0) {
            us.pos.x = this.startPos.x
            us.pos.y = this.startPos.y
            this.toGo = 0
            this.reset()
        }
    }

    update(entity, deltaTime) {
        if(this.overrideHold)
            return

        if (this.startPos.x < 0 && this.startPos.y < 0)
            this.startPos.set(entity.pos.x, entity.pos.y) // set position

        if (this.queue.length == 0)
            this.random()
        else {
            this.cancel(this.queue[0])
        }

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

function splice(arr, item) {
    let popIndex = arr.indexOf(item)
    if (popIndex >= 0) {
        arr.splice(popIndex, 1)
    }
    return arr
}