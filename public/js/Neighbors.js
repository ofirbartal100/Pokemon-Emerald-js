import Compositor from './Compositor.js'
import TileCollider from './TileCollider.js'
import { Matrix } from './math.js'


export default class Neighbors {
    constructor() {
        this.neighborsMap = new Map()
        this.locationsMap = new Map()
        this.north = 0
        this.south = 19
        this.west = 0
        this.east = 20
    }

    setBoundries(matrix) {
        this.east = matrix.grid.length - 1
        this.south = matrix.grid[0].length - 1
    }

    addNeighbor(direction, locationName) {
        if (direction) {
            this.neighborsMap.set(direction, locationName)
        }
    }

    getNeighbor(x, y) {
        let xInBounds = false
        if (x >= this.west && x <= this.east) {
            xInBounds = true
        }
        let yInBounds = false
        if (y >= this.north && y <= this.south) {
            yInBounds = true
        }

        if (y < this.north) {
            if (xInBounds && this.neighborsMap.get("north")) {
                return {
                    "neighbor": this.locationsMap.get("north"),
                    "xNeighbor": x,
                    "yNeighbor": y,
                    "direction": "north",
                    "fromDirection": "south"
                }
            }
        } else if (y > this.south) {
            if (xInBounds && this.neighborsMap.get("south")) {
                return {
                    "neighbor": this.locationsMap.get("south"),
                    "xNeighbor": x,
                    "yNeighbor": y - this.south - 1,
                    "direction": "south",
                    "fromDirection": "north"
                }
            }
        } else if (x < this.west) {
            if (yInBounds && this.neighborsMap.get("west")) {
                return {
                    "neighbor": this.locationsMap.get("west"),
                    "xNeighbor": x,
                    "yNeighbor": y,
                    "direction": "west",
                    "fromDirection": "east"
                }
            }
        } else if (x > this.east) {
            if (yInBounds && this.neighborsMap.get("east")) {
                return {
                    "neighbor": this.locationsMap.get("east"),
                    "xNeighbor": x - this.east - 1,
                    "yNeighbor": y,
                    "direction": "east",
                    "fromDirection": "west"
                }
            }
        }

        return {
            "neighbor": false,
            "xNeighbor": x,
            "yNeighbor": y,
            "direction": undefined,
            "fromDirection": undefined
        }

    }

    getNeighborTile(x, y) {
        const { neighbor, xNeighbor, yNeighbor } = this.getNeighbor(x, y)

        if (neighbor) {
            const neighborWidth = neighbor.tileCollider.tiles.matrix.grid.length
            const neighborHeight = neighbor.tileCollider.tiles.matrix.grid[0].length
            const tileX = (((xNeighbor % neighborWidth) + neighborWidth) % neighborWidth)
            const tileY = (((yNeighbor % neighborHeight) + neighborHeight) % neighborHeight)
            const layers = neighbor.comp.layers
            let tile
            for (let layer of layers) {
                if (layer.draw.name == "drawBackgroundLayer") {
                    let tempTile = layer.draw(null, null, [tileX, tileY])
                    if (tempTile) {
                        tile = tempTile
                    }
                }
            }
            return tile
        } else {
            return undefined
        }
    }

    loadLocation() {

    }

    create() {
        this.neighborsMap.forEach((location, direction) => {
            if (this.locationsMap.get(direction) === undefined) {
                this.loadLocation(location).then(location => {
                    this.locationsMap.set(direction, location)
                })
            }
        })
    }

}