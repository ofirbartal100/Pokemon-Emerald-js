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
        if (game.battleStage.active ||
            game.dialog.active) {
            return
        }
        game.menu.active = keyState ? !game.menu.active : game.menu.active
        game.player.walk.cancel()
    })

    Directions.forEach(direction => {
        input.addMapping(direction, keyState => {
            if (!game.menu.active && !game.player.inBattle ) {
                if (keyState) {
                    game.player.walk.enqueue(direction)
                } else {
                    game.player.walk.cancel(direction)
                }
            } else if (game.menu.active) {
                game.menu.move(direction, keyState)
                game.player.walk.cancel()
            } else if (game.player.inBattle) {
                game.battleStage.move(direction, keyState)
                game.player.walk.cancel()
            }
        })
    })

    Commands.forEach(command => {
        input.addMapping(command, keyState => {
            if (!game.menu.active && !game.battleStage.active) {
                game.player.interact(command, keyState, game)
            } else if (game.battleStage.active) {
                game.battleStage.action(command, keyState)
            } else if (game.menu.active) {
                game.menu.action(command, keyState)
            }
        })
    })

    input.addMapping(Select, keyState => {
        if (game.battleStage.active) {
            game.battleStage.end()
            game.player.inBattle = false
        }
    })

    input.listenTo(window)
}