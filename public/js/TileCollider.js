import TileResolver from './TileResolver.js'
import { Sides } from './Entity.js';
export default class TileCollider {
    constructor(tileMatrix) {
        this.tiles = new TileResolver(tileMatrix)
    }

    checkY(entity) {
         let y
        if (entity.vel.y > 0) {
            y = entity.bounds.bottom
        } else if (entity.vel.y < 0) {
            y = entity.bounds.top
        } else {
            return
        }
        const matches = this.tiles.searchByRange(
            entity.bounds.left, entity.bounds.right,
            y, y)
        matches.forEach(match => {
            if (match.tile.type !== 'solid' && match.tile.type !== 'portal') {
                return
            }
            if (entity.vel.y > 0) {
                if (entity.bounds.bottom > match.y1) {
                    entity.obstruct(Sides.BOTTOM, match);
                }
            } else if (entity.vel.y < 0) {
                if (entity.bounds.top < match.y2) {
                    entity.obstruct(Sides.TOP, match);
                }
            }
        })

    }

    checkX(entity) {
        let x
        if (entity.vel.x > 0) {
            x = entity.bounds.right
        } else if (entity.vel.x < 0) {
            x = entity.bounds.left
        } else {
            return
        }
        const matches = this.tiles.searchByRange(
            x, x,
            entity.bounds.top, entity.bounds.bottom)
        matches.forEach(match => {
            if (match.tile.type !== 'solid' && match.tile.type !== 'portal') {
                return
            }

            if (entity.vel.x > 0) { //right collision
                if (entity.bounds.right > match.x1) {
                    entity.obstruct(Sides.RIGHT, match);
                }
            } else if (entity.vel.x < 0) { //left collision
                if (entity.pos.x < match.x2) {
                    entity.obstruct(Sides.LEFT, match);
                }
            }
        })

    }

    test(entity) {
        if (entity.vel.y != 0)
            this.checkY(entity)
        if (entity.vel.x != 0)
            this.checkX(entity)
    }
}