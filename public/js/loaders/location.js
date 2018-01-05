import Location from '../Location.js'
import { Matrix } from '../math.js'
import { loadSpriteSheet, loadJSON } from './spriteSheet.js'

export function createLocationLoader(entityFactory) {
    return function loadLocation(name) {
        return loadJSON(`/locations/${name}.json`)
            .then(locationSpec => Promise.all([
                locationSpec,
                loadSpriteSheet(locationSpec.spriteSheet)
            ]))
            .then(([locationSpec, backgroundSprites]) => {
                const location = new Location()
                location.setup(locationSpec, entityFactory, loadLocation, backgroundSprites)

                return location
            })
    }
}


export function createCollisionGrid(tiles, locationSpec, backgroundSprites) {
    const grid = new Matrix();
    for (const { tileObj, x, y } of expandTiles(tiles, locationSpec, backgroundSprites)) {
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


function createTiles(location, backgroundsMapping, backgroundSprites) {
    for (let background of backgroundsMapping) {
        for (let range of background.ranges) {
            if (range.length == 2) {
                createTile(location, background, ...range, backgroundSprites)
            } else if (range.length == 4) { //inclusive
                if (background.tile) {
                    for (let i = range[0]; i <= range[1]; i++) {
                        for (let j = range[2]; j <= range[3]; j++) {
                            createTile(location, background, i, j, backgroundSprites)
                        }
                    }
                } else if (background.object) {
                    let size = backgroundSprites.objects.get(background.object)
                    for (let i = range[0]; i <= range[1]; i += size[0]) {
                        for (let j = range[2]; j <= range[3]; j += size[1]) {
                            createTile(location, background, i, j, backgroundSprites)
                        }
                    }
                }
            }
        }
    }
}

function createTile(location, background, offsetX, offsetY, backgroundSprites) {
    if (background.tile) {
        if (background.bounds) {
            location.bounds = {
                "name": background.tile
            }
        }
        location.tiles.set(offsetX, offsetY, {
            name: background.tile,
            type: backgroundSprites.tilesTypes.get(background.tile)
        })
    } else if (background.object) {
        let size = backgroundSprites.objects.get(background.object)
        if (background.bounds) {
            location.bounds = {
                "name": background.object,
                "size": size
            }
        }
        for (let x = 0; x < size[0]; x++) {
            for (let y = 0; y < size[1]; y++) {
                let objectPartName = `${background.object}-${size[0]*y + x}`
                location.tiles.set(offsetX + x, offsetY + y, {
                    name: objectPartName,
                    type: backgroundSprites.tilesTypes.get(objectPartName)
                })
            }
        }
    }
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
        const [xSize,ySize] = dimensions
        return expandObjectSpan(xStart, xStart + xSize -1, yStart, yStart + ySize -1, dimensions);
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
