export function createTileAnime(frames, frameLen) {
    return function resolveFrame(distance) {
        let frameIndex = Math.floor(distance / frameLen) % frames.length
        let frameName = frames[frameIndex]
        return frameName
    }
}

export function createAnime(frames, framesOffsets, frameLen) {
    return function resolveFrame(distance) {
        let frameIndex = Math.floor(distance / frameLen) % frames.length
        let frameName = frames[frameIndex]
        let frameOffset = framesOffsets[frameIndex]
        return { "frameName": frameName, "frameOffset": frameOffset }
    }
}