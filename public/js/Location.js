import Compositor from './Compositor.js'
import Neighbors from './Neighbors.js'
import EntityCollider from './EntityCollider.js'
import TileCollider from './TileCollider.js'
import { createSpriteLayer } from './layers/sprites.js'
import { createBackgroundLayer } from './layers/background.js'
import { createBackgroundGrid, createCollisionGrid } from './loaders/location.js'
import { Matrix } from './math.js'
const SCREENX = 240
const SCREENY = 160

export default class Location {
    constructor(name) {
        this.name = name
        this.comp = new Compositor()
        this.entities = new Set()
        this.entityCollider = new EntityCollider(this.entities)
        this.tileCollider = null
        this.totalTime = 0
        this.bounds = { name: "big-tree", size: [2, 2] }
        this.audio = new Audio()
        this.neighbors = new Neighbors()
        this.active = false
    }

    next(nextLocation, fromDirection) {
        const player = Array.from(this.entities).pop()
        this.entities.delete(player)
        this.audio.pause()
        this.audio.currentTime = 0
        const self = Object.assign({}, this)
        self.active = false
        self.totalTime = 0
        Object.assign(this, nextLocation)
        if(fromDirection){
            this.neighbors.locationsMap.set(fromDirection, self)
        }
        this.entities.add(player)
    }

    moveLocation(entity) {
        const [x, y] = entity.pos.toIndex()
        const col = this.tileCollider.tiles.matrix.grid[x]
        if (col == undefined || col[y] == undefined) {
            const { neighbor, xNeighbor, yNeighbor, fromDirection } = this.neighbors.getNeighbor(x, y)
            const neighborWidth = neighbor.tileCollider.tiles.matrix.grid.length + 1
            const neighborHeight = neighbor.tileCollider.tiles.matrix.grid[0].length + 1
            const xEntity = (((xNeighbor % neighborWidth) + neighborWidth) % neighborWidth)
            const yEntity = (((yNeighbor % neighborHeight) + neighborHeight) % neighborHeight)
            this.next(neighbor, fromDirection)
            entity.move(xEntity * 16, yEntity * 16)
        }
    }

    focus(camera, entity) {
        this.moveLocation(entity)
        camera.pos.set(
            entity.pos.x - SCREENX / 2 + entity.size.x / 2,
            entity.pos.y - SCREENY / 2 + entity.size.y / 2)
    }

    init() {
        this.audio.play()
        this.neighbors.setBoundries(this.tileCollider.tiles.matrix)
        this.neighbors.create()
        this.active = true
    }

    update(deltaTime) {
        if (!this.active && this.totalTime > 0) {
            this.init()
        }
        this.entities.forEach(entity => {
            entity.update(deltaTime)

            this.tileCollider.test(entity)
            this.entityCollider.check(entity)
        })
        this.totalTime += deltaTime
    }

    setupEncounter(locationSpec) {
        if (locationSpec.encounters) {
            for (let area in locationSpec.encounters) {
                for (let pokemon of locationSpec.encounters[area]) {
                    this.tileCollider.addToArea(area, pokemon)
                }
            }
        }
    }

    setup(locationSpec, entityFactory, loadLocation, backgroundSprites) {
        this.neighbors.loadLocation = loadLocation
        this.setupCollision(locationSpec, backgroundSprites)
        this.setupBackgrounds(locationSpec, backgroundSprites)
        this.setupEntities(locationSpec, entityFactory)
        this.setupAudio(locationSpec)
        this.setupNeigbors(locationSpec)
        this.setupEncounter(locationSpec)
    }

    setupEntities(locationSpec, entityFactory) {
        if (locationSpec.entities) {
            locationSpec.entities.forEach(({ name, pos: [x, y], messages }) => {
                const createEntity = entityFactory[name]
                const entity = createEntity()
                entity.pos.set(x, y)
                entity.messages = messages
                this.entities.add(entity)
            })

            const entitiesLayer = createSpriteLayer(this.entities)
            this.comp.layers.push({ name: 'entities', draw: entitiesLayer })
        }
    }

    setupAudio(locationSpec) {
        if (locationSpec.audio) {
            this.audio.src = locationSpec.audio
            this.audio.loop = true
        }
    }

    setupNeigbors(locationSpec) {
        if (locationSpec.neighbors) {
            locationSpec.neighbors.forEach(({ direction, location }) => {
                this.neighbors.addNeighbor(direction, location)
            })
        }
    }

    setupCollision(locationSpec, backgroundSprites) {
        const mergedTiles = locationSpec.layers.reduce((mergedTiles, layerSpec) => {
            return mergedTiles.concat(layerSpec.tiles);
        }, []);
        const collisionGrid = createCollisionGrid(mergedTiles, locationSpec, backgroundSprites);
        this.tileCollider = new TileCollider(collisionGrid)
    }

    setupBackgrounds(locationSpec, backgroundSprites) {
        locationSpec.layers.forEach(layer => {
            for(const tile of layer.tiles){
                for(const property in tile){
                    if(property == 'bounds'){
                        this.bounds = {name:tile.name}

                        if(backgroundSprites.objects.has(tile.name)){
                            this.bounds.size = backgroundSprites.objects.get(tile.name)
                        }
                    }
                }
            }
            const backgroundGrid = createBackgroundGrid(layer.tiles, locationSpec, backgroundSprites);
            const backgroundLayer = createBackgroundLayer(this, backgroundGrid, backgroundSprites, layer.name);

            this.comp.layers.push({ name: layer.name, draw: backgroundLayer });
        });
    }
}