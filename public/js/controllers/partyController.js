import Controller from '../Controller.js'
import { Commands } from '../input.js'
import { Vec2 } from '../math.js'

const BATTLE = 0
const INFO = 1

const PARTY = 0
const MENU = 1
const SWITCH_POKEMON = 2
const SUMMERY = 3

export default class PartyController extends Controller {
    constructor(partyPage) {
        super()
        this.partyPageRef = partyPage
        this.partyCursor = new Vec2(0, 0)
        this.partyMenuCursor = 0
        this.summeryCursor = 0
        this.switchPair = []
        this.stage = PARTY
    }

    up() {
        const yMod = Math.min(3, this.partyPageRef.party.pokemons.length / 2) + 1
        const pMod = this.partyPageRef.party.pokemons.length
        if (this.stage == PARTY || this.stage == SWITCH_POKEMON) {
            this.partyCursor.y = (this.partyCursor.y + yMod - 1) % yMod //-1mod yMod
        } else if (this.stage == MENU) {
            this.partyMenuCursor = (this.partyMenuCursor + pMod - 1) % pMod
        } else if (this.stage == SUMMERY) {
            let pokemonSummeryIndex = this.partyCursor.y * 2 + this.partyCursor.x
            pokemonSummeryIndex = (pokemonSummeryIndex - 1) % pMod
            this.partyCursor.y = Math.floor(pokemonSummeryIndex / 2)
            this.partyCursor.x = pokemonSummeryIndex % 2
        }
    }

    down() {
        const yMod = Math.min(3, this.partyPageRef.party.pokemons.length / 2) + 1
        const pMod = this.partyPageRef.party.pokemons.length
        if (this.stage == PARTY || this.stage == SWITCH_POKEMON) {
            this.partyCursor.y = (this.partyCursor.y + 1) % yMod
        } else if (this.stage == MENU) {
            this.partyMenuCursor = (this.partyMenuCursor + 1) % pMod
        } else if (this.stage == SUMMERY) {
            let pokemonSummeryIndex = this.partyCursor.y * 2 + this.partyCursor.x
            pokemonSummeryIndex = (pokemonSummeryIndex + 1) % pMod
            this.partyCursor.y = Math.floor(pokemonSummeryIndex / 2)
            this.partyCursor.x = pokemonSummeryIndex % 2
        }
    }

    left() {
        if (this.stage == PARTY || this.stage == MENU || this.stage == SWITCH_POKEMON) {
            this.partyCursor.x = (this.partyCursor.x + 1) % 2
        } else if (this.stage == SUMMERY) {
            this.summeryCursor = (this.summeryCursor + 4) % 5 //-1mod5
        }
    }

    right() {
        if (this.stage == PARTY || this.stage == MENU || this.stage == SWITCH_POKEMON) {
            this.partyCursor.x = (this.partyCursor.x + 1) % 2 //-1mod2
        } else if (this.stage == SUMMERY) {
            this.summeryCursor = (this.summeryCursor + 1) % 5
        }
    }

    a() {
        switch (this.stage) {
            case PARTY:
                if (this.partyCursor.y == Math.min(4, this.partyPageRef.party.pokemons.length / 2 + 1) - 1) {
                    this.b()
                } else {
                    this.openMenu()
                }
                break

            case MENU:
                switch (this.partyPageRef.pokemonMenu[this.partyMenuCursor]) {
                    case 'SUMMERY':
                        this.showSummery()
                        break

                    case 'SWITCH':
                        this.startSwitchPokemonPosition()
                        break

                    case 'SWITCH IN':
                        this.partyPageRef.party.fightingPokemon = this.partyCursor.x + this.partyCursor.y * 2
                        this.exit()
                        break

                    case 'ITEM':
                        alert('and Item')
                        break

                    case 'CANCEL':
                        this.closeMenu()
                        break

                }
                break

            case SWITCH_POKEMON:
                if (this.partyCursor.y == Math.min(4, this.partyPageRef.party.pokemons.length / 2 + 1) - 1) {
                    this.b()
                } else {
                    this.switchPokemonPosition()
                }
                break

            case SUMMERY:

                break
        }
    }

    b() {
        switch (this.stage) {
            case PARTY:
                this.partyCursor.set(0, 0)
                this.partyPageRef.active = false
                break

            case MENU:
            case SWITCH_POKEMON:
            case SUMMERY:
                this.closeMenu()
                break
        }
    }

    start() {

    }


    //unique methods
    openMenu() {
        this.stage = MENU
        this.partyMenuCursor = 0
        this.partyPageRef.chosenPokemon = this.partyPageRef.party.pokemons[this.getSelectedIndex().pokemon]
        this.partyPageRef.dialogPhrase = `What To Do With ${this.partyPageRef.chosenPokemon.name} ?`
    }

    exit() {
        this.partyPageRef.active = false
        this.partyCursor.set(0, 0)
        this.stage = PARTY
    }

    closeMenu() {
        this.stage = PARTY
        this.partyPageRef.dialogPhrase = 'Choose a Pokemon.'
    }

    getSelectedIndex() {
        return {
            pokemon: this.partyCursor.x + this.partyCursor.y * 2,
            menu: this.partyMenuCursor
        }
    }

    startSwitchPokemonPosition() {
        this.stage = SWITCH_POKEMON
        this.partyPageRef.dialogPhrase = 'Choose a Pokemon to switch with.'
        this.switchPair[0] = this.partyCursor.y * 2 + this.partyCursor.x
    }

    switchPokemonPosition() {
        this.switchPair[1] = this.partyCursor.y * 2 + this.partyCursor.x
        this.partyPageRef.party.switch(...this.switchPair)
        this.closeMenu()
    }

    showSummery() {
        this.stage = SUMMERY

    }
}