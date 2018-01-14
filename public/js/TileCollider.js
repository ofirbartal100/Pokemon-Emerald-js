import TileResolver from './TileResolver.js'
import WildBattle from './battles/WildBattle.js'
import { Sides } from './Entity.js';
export default class TileCollider {
    constructor(tileMatrix) {
        this.tiles = new TileResolver(tileMatrix)
        this.battleAreas = new Map()
    }

    addToArea(area, pokemon) {
        if (this.battleAreas.has(area)) {
            const areaMap = this.battleAreas.get(area)
            areaMap.set(pokemon.name, pokemon)
        } else {
            this.battleAreas.set(area, new Map())
            this.addToArea(area, pokemon)
        }
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
            if (match.tile.type !== 'solid' && match.tile.type !== 'portal' && !this.battleAreas.has(match.tile.type)) {
                return
            }
            if (match.tile.type == 'portal' && entity.role == "Player") {
                entity.warp(match.tile.portal)
                return
            }

            if (entity.role == "Player" && !entity.inBattle && this.battleAreas.has(match.tile.type)) {
                this.encounter(entity, match.tile.type)
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
            if (match.tile.type !== 'solid' && match.tile.type !== 'portal' && !this.battleAreas.has(match.tile.type)) {
                return
            }

            if (match.tile.type == 'portal' && entity.role == "Player") {
                entity.warp(match.tile.portal)
                return
            }

            if (entity.role == "Player" && !entity.inBattle && this.battleAreas.has(match.tile.type)) {
                this.encounter(entity, match.tile.type)
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


    encounter(entity, tileType) {
        const encounter = Math.random() * 16
        const encounterRate = 0.2
        if (encounter < encounterRate) {
            const areaMap = this.battleAreas.get(tileType)
            let randPokemon = Math.random()
            for (let [name, encounterPokemonSpec] of areaMap) {
                if (randPokemon < encounterPokemonSpec.rate) {
                    let randPokemonLevel = Math.round(Math.random() * (encounterPokemonSpec.levels[1] - encounterPokemonSpec.levels[0])) + encounterPokemonSpec.levels[0]
                    entity.battle(new WildBattle(tileType, encounterPokemonSpec.id, randPokemonLevel, entity))
                    return
                } else {
                    randPokemon -= encounterPokemonSpec.rate
                }
            }
        }
    }
}