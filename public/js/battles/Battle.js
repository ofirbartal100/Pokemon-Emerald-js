export default class Battle {
    constructor(arena, player) {
        this.arena = arena
        this.player = player
        this.dialog = null
        this.foe = null
        this.ally = null
    }

    move(direction, keyState) {
        this.dialog.move(direction, keyState)
    }

    action(command, state) {
        this.dialog.action(command, state)
    }

    getAlly() {
        if (this.ally) {
            return this.ally
        }
        console.log('no ally')
        return false
    }

    getFoe() {
        if (this.foe) {
            return this.foe
        }
        console.log('no foe')
        return false
    }

    end() {
        this.player.inBattle = false
    }
}