export default class Battle {
    constructor(arena, player) {
        this.arena = arena
        this.player = player
        this.dialog = null
        this.foe = null
        this.ally = null
    }

    startTurn(properties) {
        if (properties.type == 'move') {
            this.moveTurn(properties.moveIndex)
        }
    }

    moveTurn(moveIndex) {
        let fightingPokemon = this.player.party.pokemons[this.player.party.fightingPokemon]
        fightingPokemon.attack(moveIndex, this.foe.pokemon)

        if(this.foe.pokemon.currHP == 0)
            return
        
        let randomFoeMoveIndex = Math.floor(Math.random() * this.foe.pokemon.attacks.length)
        this.foe.pokemon.attack(randomFoeMoveIndex, fightingPokemon)
    }

    update(deltaTime){
        this.dialog.update(deltaTime)
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