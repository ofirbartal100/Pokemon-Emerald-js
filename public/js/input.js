import KeyboardState from './KeyboardState.js'

const Directions = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']
const A = 'KeyZ'
const B = 'KeyX'
const Start = 'Enter'
const Select = 'ShiftRight'
export const Commands = [A, B, Select]

export function setupGameKeyboard(game) {

    const input = new KeyboardState()

    input.addMapping(Start, keyState => {
        game.menu.active = keyState ? !game.menu.active : game.menu.active
    })

    Directions.forEach(direction => {
        input.addMapping(direction, keyState => {
            if (!game.menu.active) {
                if (keyState) {
                    game.player.walk.enqueue(direction)
                } else {
                    game.player.walk.cancel(direction)
                }
            } else {
                game.menu.move(direction, keyState)
            }
        })
    })

    Commands.forEach(command => {
        input.addMapping(command, keyState => {
            if (!game.menu.active) {
                game.player.interact(command, keyState, game)
            } else {
                game.menu.choose(command, keyState)
            }
        })
    })

    input.listenTo(window)
}