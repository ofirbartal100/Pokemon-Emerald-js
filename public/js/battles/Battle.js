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

        if (this.foe.pokemon.currHP == 0) {
            this.rewardExp()
            return
        }


        let randomFoeMoveIndex = Math.floor(Math.random() * this.foe.pokemon.attacks.length)
        this.foe.pokemon.attack(randomFoeMoveIndex, fightingPokemon)
    }

    rewardExp() { 
        let reward = 0
        let rewardedPokemon = this.player.party.pokemons[this.player.party.fightingPokemon]
        let a, t, b, e, L, p, f, v, s

        //battle type
        if (this.foe.type == 'wildSingle') {
            a = 1
        } else {
            a = 1.5
        }

        //base EXP
        b = this.foe.pokemon.baseExp

        //lucky egg
        if (rewardedPokemon.holdItem == 'Lucky Egg') {
            e = 1.5
        } else {
            e = 1
        }

        //affection
        f = 1

        //level
        L = this.foe.pokemon.level

        //point power
        p = 1

        //EXP Sharing
        s = 1

        //is traded pokemon
        t = 1

        //should evolve
        v = 1

        //unscaled formula
        reward = (a * t * b * e * L * p * f * v) / (7 * s)
        
        //scaled formula
        //reward = (( (a * b * L)/(5 * s) ) * ( (Math.power((2 * L + 10),2.5))/(Math.power((L + Lp + 10),2.5)) ) + 1) *t * e * p
        
        rewardedPokemon.gainEXP(reward)
    }

    update(deltaTime) {
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