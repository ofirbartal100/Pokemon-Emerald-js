import TileResolver from './TileResolver.js'
export default class Encounter {
    constructor(matrix) {
        this.tiles = new TileResolver(matrix)
        this.areas = new Map()
        this.rate = 0.20
    }

    addToArea(area,pokemon,rate){
        if(this.areas.has(area)){
            const areaMap = this.areas.get(area)
            areaMap.set(pokemon,rate)
        } else {
            this.areas.set(area,new Map())
            this.addToArea(area,pokemon,rate)
        }
    }

    encounter(match) {
        if (this.areas.has(match.tile.type)) {
            const encounter = Math.random() * 16
            if (encounter < this.rate) {
                const areaMap = this.areas.get(match.tile.type)
                let randPokemon = Math.random()
                for( let [pokemon,rate] of areaMap){
                    if(randPokemon<rate){
                        console.log(pokemon)
                        return
                    }
                    else{
                        randPokemon -= rate
                    }
                }
            }
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
        matches.forEach(match=>this.encounter(match))

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
        matches.forEach(match=>this.encounter(match))
    }

    test(entity) {
        if (entity.vel.y != 0)
            this.checkY(entity)
        if (entity.vel.x != 0)
            this.checkX(entity)
    }
}