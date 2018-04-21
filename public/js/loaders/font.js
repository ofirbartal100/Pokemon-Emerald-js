import SpriteSheet from '../SpriteSheet.js'
import { loadImage } from './spriteSheet.js'

export function loadFont(name) {
    return loadImage(`/img/font.png`)
        .then(image => {
            let width = 6,
                height = 10
            const font = new SpriteSheet(image, width, height)
            defineLetters('ABCDEFGHIJKLMNOPQRSTUVWX', 585, 180, 1, font)
            defineLetters('YZabcde', 585, 193, 1, font)
            font.define('f', 'noType', 585 + 49, 193, 5, 10)
            defineLetters('gh', 585 + 55, 193, 1, font)
            font.define('i', 'noType', 585 + 69, 193, 2, 10)
            font.define('j', 'noType', 585 + 72, 193, 4, 10)
            font.define('k', 'noType', 585 + 77, 193, 6, 10)
            font.define('l', 'noType', 585 + 84, 193, 3, 10)
            defineLetters('mnopqrstuvw', 585 + 88, 193, 1, font)
            defineLetters('xyz', 585, 206, 1, font)

            font.putText = function drawText(text, x, y, context, size = 1) {
                let space = 1
                let curX = x
                for (let letter of text) {
                    let width = font.width
                    if (letter == "i") {
                        width = 2
                    } else if (letter == "l") {
                        width = 3
                    } else if (letter == "j") {
                        width = 4
                    } else if (letter == "f") {
                        width = 5
                    }
                    font.drawInSize(letter, context, curX, y, size)

                    curX += (width + space) * size
                }
            }

            return font
        })
}

function defineLetters(letters, startX, startY, space, font) {
    let i = 0
    for (let letter of letters) {
        font.define(letter, 'noType', startX + i * (font.width + space), startY, font.width, font.height)
        i += 1
    }
}