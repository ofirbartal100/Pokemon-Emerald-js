import Location from '../Location.js'
import { Matrix } from '../math.js'
import { loadSpriteSheet, loadJSON } from './spriteSheet.js'

export function createLocationLoader(entityFactory,dataBase) {
    return function loadLocation(name) {
        return loadJSON(`/locations/${name}.json`)
            .then(locationSpec => Promise.all([
                locationSpec,
                loadSpriteSheet(locationSpec.spriteSheet)
            ]))
            .then(([locationSpec, backgroundSprites]) => {
                const location = new Location(name)
                location.addToDataBase = function(item,data){
                    dataBase.add.call(dataBase,item,data)
                }
                location.setup(locationSpec, entityFactory, loadLocation, backgroundSprites)

                return location
            })
    }
}

export function createCollisionGrid(tiles, locationSpec, backgroundSprites) {
    const grid = new Matrix();
    for (const { tileObj, x, y } of expandTiles(tiles, locationSpec, backgroundSprites)) {
        if (tileObj.portal)
            grid.set(x, y, { type: tileObj.type, portal: tileObj.portal })
        else
            grid.set(x, y, { type: tileObj.type });
    }
    return grid;
}

export function createBackgroundGrid(tiles, locationSpec, backgroundSprites) {
    const grid = new Matrix();

    for (const { tileObj, x, y } of expandTiles(tiles, locationSpec, backgroundSprites)) {
        grid.set(x, y, { name: tileObj.name });
    }

    return grid;
}


function* expandSpan(xStart, xEnd, yStart, yEnd) {
    for (let x = xStart; x <= xEnd; ++x) {
        for (let y = yStart; y <= yEnd; ++y) {
            yield { x, y };
        }
    }
}

function* expandObjectSpan(xStart, xEnd, yStart, yEnd, dimentions) {
    let xCount = 0
    let yCount = 0
    for (let x = xStart; x <= xEnd; ++x, xCount = (xCount + 1) % dimentions[0]) {
        for (let y = yStart; y <= yEnd; ++y, yCount = (yCount + 1) % dimentions[1]) {
            let objectPart = dimentions[0] * yCount + xCount
            yield { x, y, objectPart };
        }
    }
}

function expandRange(range) {
    if (range.length === 4) {
        const [xStart, xEnd, yStart, yEnd] = range;
        return expandSpan(xStart, xEnd, yStart, yEnd);

    } else if (range.length === 3) {
        const [xStart, xEnd, yStart] = range;
        return expandSpan(xStart, xEnd, yStart, yStart);

    } else if (range.length === 2) {
        const [xStart, yStart] = range;
        return expandSpan(xStart, xStart, yStart, yStart);
    }
}

function expandObjectRange(range, dimensions) {
    if (range.length === 4) {
        const [xStart, xEnd, yStart, yEnd] = range;
        return expandObjectSpan(xStart, xEnd, yStart, yEnd, dimensions);

    } else if (range.length === 3) {
        const [xStart, xEnd, yStart] = range;
        return expandObjectSpan(xStart, xEnd, yStart, yStart, dimensions);

    } else if (range.length === 2) {
        const [xStart, yStart] = range;
        const [xSize, ySize] = dimensions
        return expandObjectSpan(xStart, xStart + xSize - 1, yStart, yStart + ySize - 1, dimensions);
    }
}

function* expandRanges(ranges) {
    for (const range of ranges) {
        yield* expandRange(range);
    }
}

function* expandObjectRanges(ranges, dimensions) {
    for (const range of ranges) {
        yield* expandObjectRange(range, dimensions);
    }
}

function* expandTiles(tiles, locationSpec, backgroundSprites) {
    function* walkObject(object, dimensions, offsetX, offsetY) {
        for (const { x, y, objectPart } of expandObjectRanges(object.ranges, dimensions)) {
            // const derivedX = x + offsetX;
            // const derivedY = y + offsetY;
            const tileName = `${object.name}-${objectPart}`
            const tileType = backgroundSprites.tilesTypes.get(tileName)
            const tileObj = { name: tileName, type: tileType }
            if (object.portals) {
                tileObj.portal = object.portals[0]
            }
            // yield {
            //     tileType,
            //     x: derivedX,
            //     y: derivedY,
            // };
            yield {
                tileObj,
                x: x,
                y: y,
            };
        }
    }


    function* walkTiles(tiles, offsetX, offsetY) {
        for (const tile of tiles) {
            let portals = 0
            for (const { x, y } of expandRanges(tile.ranges)) {
                // const derivedX = x + offsetX;
                // const derivedY = y + offsetY;
                if (backgroundSprites.objects.has(tile.name)) {
                    const objDimensions = backgroundSprites.objects.get(tile.name)
                    // yield* walkObject(tile, objDimensions, derivedX, derivedY);
                    yield* walkObject(tile, objDimensions, x, y);
                } else {

                    const tileName = tile.name
                    const tileType = backgroundSprites.tilesTypes.get(tile.name)
                    const tileObj = { name: tileName, type: tileType }
                    if (tile.portals) {
                        tileObj.portal = tile.portals[portals++]
                    }
                    // yield {
                    //     tileType,
                    //     x: derivedX,
                    //     y: derivedY,
                    // };
                    yield {
                        tileObj,
                        x: x,
                        y: y,
                    };
                }
            }
        }
    }

    yield* walkTiles(tiles, 0, 0);
}