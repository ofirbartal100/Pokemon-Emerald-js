export class Matrix {
    constructor() {
        this.grid = []
    }

    forEach(callback) {
        this.grid.forEach((column, x) => {
            column.forEach((value, y) => {
                callback(value, x, y)
            })
        })
    }

    get(x, y) {
        const col = this.grid[x]
        if (col) {
            return col[y]
        }
        return undefined
    }

    set(x, y, value) {
        if (!this.grid[x]) {
            this.grid[x] = []
        }

        this.grid[x][y] = value
    }
}


export class Vec2 {
    constructor(x, y) {
        this.set(x, y)
        this.tileSize = 16
    }

    set(x, y) {
        this.x = x
        this.y = y
    }

    distance(deltaTime) {
        let x_distance_square = this.x * this.x * deltaTime * deltaTime
        let y_distance_square = this.y * this.y * deltaTime * deltaTime
        return Math.sqrt(x_distance_square + y_distance_square)
    }

    distanceX(deltaTime) {
        return this.x * deltaTime
    }

    distanceY(deltaTime) {
        return this.y * deltaTime
    }

    toIndex(){
        return [Math.floor(this.x / this.tileSize) , Math.floor(this.y / this.tileSize)]
    }
}