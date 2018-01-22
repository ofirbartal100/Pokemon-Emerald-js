export default class Move {
    constructor(specs, typeTable) {
        if (specs) {
            for (let property in specs) {
                this[property] = specs[property]
            }
            this.typeTable = typeTable
        } else {
            this.name = 'Empty'
        }
    }

    use(user, foe) {
        console.log(user, foe)

        let damage, modifier = 0
        let attack, defense
        let targets, weather, critical, random, STAB, type, burn, other

        targets = 1
        weather = 1
        burn = 1
        other = 1
        STAB = 1
        critical = this.generateCritical(user, foe)
        random = this.generateRandom()

        if (user.type1 == this.Type || user.type2 == this.Type) {
            STAB = 1.5
            if (user.ability == "ADAPTABILITY") {
                STAB = 2
            }
        }
        type = this.getTypeModifior(foe.type1, foe.type2)
        modifier = targets * weather * critical * random * STAB * type * burn * other

        let power = parseInt(this.BasePower)
        if (this.DamageCategory == "Physical") {
            attack = user.Attack
            defense = foe.Defense
        } else if (this.DamageCategory == "Special") {
            attack = user.SpAttack
            defense = foe.SpDefense
        } else{
            return 0
        }

        damage = ((((2 * user.level) / 5 + 2) * power * attack / defense) / 50 + 2) * modifier
        foe.hurt(damage)
    }

    generateCritical(user, foe) {
        const CRITICAL = 2
        const NORMAL = 1
        let stage = 0
        let probabilityTable = [1 / 16, 1 / 8, 1 / 2]
        let rate
        if (stage < 3) {
            rate = probabilityTable[stage]
        } else {
            rate = 1
        }

        let rand = Math.random()
        if (rand < rate) {
            return CRITICAL
        } else {
            return NORMAL
        }
    }

    generateRandom() {
        let min = 0.85
        let max = 1
        return Math.random() * (max - min) + min
    }

    getTypeModifior(type1, type2) {
        let multiplier = 1

        let typeCol1 = this.typeTable.get(type1)
        for (let weakness of typeCol1.Weaknesses) {
            if (this.Type == weakness) {
                multiplier *= 2
            }
        }
        for (let resistance of typeCol1.Resistances) {
            if (this.Type == resistance) {
                multiplier *= 1 / 2
            }
        }

        if (type2) {
            let typeCol2 = this.typeTable.get(type2)
            for (let weakness of typeCol2.Weaknesses) {
                if (this.Type == weakness) {
                    multiplier *= 2
                }
            }
            for (let resistance of typeCol2.Resistances) {
                if (this.Type == resistance) {
                    multiplier *= 1 / 2
                }
            }
        }

        return multiplier
    }
}