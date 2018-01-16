import Move from './Move.js'

export default class Pokemon {
    constructor(id) {
        this.id = id
        // this.level = level
        this.status = null
        this.currHP = 0
        this.boosts = [0, 0, 0, 0, 0, 0, 0]
        this.moves = []
        this.attacks = []
    }

    attack(move, foe) {
        console.log(move, foe)
    }

    heal(amount, status) {
        if (amount) {
            this.currHP += amount
        }
        if (status) {
            if (this.status == status) {
                this.status = null
            }
        }
    }

    setLevel(level, databaseMoves) {
        this.level = level
        this.load(this.specs)
        this.loadMoves(databaseMoves)
    }

    load(pokemonSpec) {
        this.setAbility(pokemonSpec.Abilities, pokemonSpec.HiddenAbility)
        this.setStats(...pokemonSpec.BaseStats)
        this.effortPoints = pokemonSpec.EffortPoints
        //this.setPos(pokemonSpec.BattlerAltitude, pokemonSpec.BattlerEnemyY, pokemonSpec.BattlerPlayerY)
        //this.setData(pokemonSpec.Color, pokemonSpec.Compatibility, pokemonSpec.Habitat, pokemonSpec.Height, pokemonSpec.Weight, pokemonSpec.Kind, pokemonSpec.Pokedex, pokemonSpec.Rareness, pokemonSpec.Shape)
        this.eggMoves = pokemonSpec.EggMoves
        this.evolutions = pokemonSpec.Evolutions
        this.setGender(pokemonSpec.GenderRate)
        this.growthRate = pokemonSpec.GrowthRate
        this.happiness = pokemonSpec.Happiness
        this.name = pokemonSpec.Name
        this.setMoves(pokemonSpec.Moves)
        this.stepsToHatch = pokemonSpec.StepsToHatch
        this.setHoldItem(pokemonSpec)
        this.type1 = pokemonSpec.Type1
        this.type2 = pokemonSpec.Type2

        //init HP
        this.heal(this.HP)
    }

    setAbility(ablities, hidden) {
        if (ablities[0].length == 1) {
            this.ability = ablities
        } else {
            this.ability = ablities[Math.floor(Math.random() * ablities.length)]
        }
    }

    setHoldItem(pokemonSpec) {
        let rand = Math.random()
        let rate, item
        if (pokemonSpec.WildItemCommon) {
            item = pokemonSpec.WildItemCommon
            rate = 0.5
        } else if (pokemonSpec.WildItemUncommon) {
            item = pokemonSpec.WildItemUncommon
            rate = 0.05
        } else if (pokemonSpec.WildItemRare) {
            item = pokemonSpec.WildItemRare
            rate = 0.01
        } else {
            this.holdItem = ""
            return
        }
        if (rand < rate) {
            this.holdItem = item
        } else {
            this.holdItem = ""
        }
    }

    setGender(GenderRate) {
        let rand = Math.random()
        let rate = 0
        if (GenderRate == "AlwaysMale") {
            this.gender = "Male"
        } else if (GenderRate == "FemaleOneEighth") {
            rate = 1 / 8
        } else if (GenderRate == "Female25Percent") {
            rate = 0.25
        } else if (GenderRate == "Female50Percent") {
            rate = 0.5
        } else if (GenderRate == "Female75Percent") {
            rate = 0.75
        } else if (GenderRate == "FemaleSevenEighths") {
            rate = 7 / 8
        } else if (GenderRate == "AlwaysFemale") {
            this.gender = "Female"
        } else if (GenderRate == "Genderless") {
            this.gender = "Genderless"
        }
        if (rate) {
            if (rand < rate) {
                this.gender = "Female"
            } else {
                this.gender = "Male"
            }
        }
    }

    setStats(HP, Attack, Defense, Speed, SpecialAttack, SpecialDefense) {
        /*
        Six comma-separated values, corresponding to:
        HP
        Attack
        Defense
        Speed
        Special Attack
        Special Defense
        Each value can be between 0 and 255 inclusive.
        */
        this.HP = HP + 2 * this.level
        this.Attack = Attack + 2 * this.level
        this.Defense = Defense + 2 * this.level
        this.SpAttack = SpecialAttack + 2 * this.level
        this.SpDefense = SpecialDefense + 2 * this.level
        this.Speed = Speed + 2 * this.level
    }

    setMoves(moves) {
        let potentialAttaks = []
        for (let move of moves) {
            if (move.level <= this.level) {
                potentialAttaks.push(move.move)
            }
        }

        for (let i = 0; i < (4 < potentialAttaks.length ? 4 : potentialAttaks.length); i++) {
            let attack = potentialAttaks.splice(Math.floor(Math.random() * potentialAttaks.length), 1)[0];
            this.attacks.push(attack)
        }

    }

    loadMoves(databaseMoves) {
        for (let attack of this.attacks) {
            if (attack == '') {
                this.moves.push(new Move())
            } else {
                if (databaseMoves && databaseMoves.has(attack))
                    this.moves.push(new Move(databaseMoves.get(attack)))
            }
        }
    }
}