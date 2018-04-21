import Camera from './Camera.js'
import Timer from './Timer.js'
import Menu from './Menu.js'
import Dialog from './Dialog.js'
import PartyPage from './PartyPage.js'
import BagPage from './BagPage.js'
import BattleStage from './BattleStage.js'
import DataBase from './DataBase.js'
import { loadDataBase } from './loaders/dataBase.js'
import { loadPartyPage } from './loaders/partyPage.js'
import { loadBagPage } from './loaders/bagPage.js'
import { loadBattleStage } from './loaders/battleStage.js'
import { loadFont } from './loaders/font.js'

export default class Game {
    constructor() {
        this.timer = new Timer(1 / 60)
        this.dataBase = new DataBase()
        this.menu = new Menu()
        this.dialog = new Dialog()

        this.battleStage = new BattleStage()
        this.partyPage = new PartyPage()
        this.bagPage = new BagPage()

        this.camera = new Camera()
        this.location = null
        this.player = null
    }

    loadComponents() {
        return Promise.all([
            loadDataBase(this.dataBase),
            loadPartyPage(this.partyPage),
            loadBagPage(this.bagPage),
            loadBattleStage(this.battleStage),
            loadFont()
        ]).then((args) => {
            this.battleStage.PartyPage = this.partyPage
            this.battleStage.BagPage = this.bagPage
            this.battleStage.getPokemon = function createPokemon(id) {
                return game.dataBase.getPokemon(id)
            }
            this.battleStage.battleData = {
                typeTable: this.dataBase.typeTable,
                moves: this.dataBase.moves,
            }

            this.menu.font = args[4]
            this.battleStage.font = args[4]

        })
    }

    setPlayer(trainer) {
        if (this.location) {
            this.player = trainer
            const self = this
            this.menu.player = this.player
            this.partyPage.party = this.player.party
            this.menu.routAction = function(action, value) {
                if (this.chosenItem == "Pokemons") {
                    if (action == 'init')
                        self.partyPage.active = true
                    else if (action == 'action')
                        self.partyPage.action(value, true)
                    else if (action == 'move')
                        self.partyPage.move(value, true)

                    if (!self.partyPage.active)
                        this.chosenItem = null
                }
            }

            this.player.warp = function warpToLocation(location) {
                const game = self
                if (game.location.neighbors && game.location.neighbors.neighborsMap.has(location)) {
                    const warpLocation = game.location.neighbors.locationsMap.get(location)
                    const fromLocation = game.location.name
                    game.location.next(warpLocation, fromLocation)
                    let portals = game.location.tileCollider.tiles.searchByType("portal")
                    for (let portal of portals) {
                        if (portal.portal == fromLocation) {
                            trainer.move(portal.x * 16, portal.y * 16)
                        }
                    }
                }
            }

            this.player.battle = function pokemonEncount(battle) {
                game.battleStage.init(battle)
                this.inBattle = true
                console.log(battle)
            }

            this.player.getArea = function fetchArea(area) {
                return game.dataBase.areas.get(area);
            }

            this.location.entities.add(this.player)
        }
    }

    update(deltaTime) {
        if (this.location) {

            if (!this.location.change) {
                const game = this
                this.location.change = function changeLocation(nextLocation, fromDirection) {
                    const player = Array.from(this.entities).pop()
                    this.entities.delete(player)
                    this.audio.pause()
                    this.audio.currentTime = 0
                    this.active = false
                    this.totalTime = 0

                    game.location = nextLocation

                    if (fromDirection) {
                        game.location.neighbors.locationsMap.set(fromDirection, this)
                    }
                    game.location.entities.add(player)
                }
            }

            this.location.update(deltaTime)
        }
        this.menu.update(deltaTime)
        this.dialog.update(deltaTime)
        this.battleStage.update(deltaTime)
        this.partyPage.update(deltaTime)
    }

    draw(context) {
        if (this.location) {
            this.location.focus(this.camera, this.player)
            this.location.comp.draw(context, this.camera)
        }
        this.menu.draw(context)
        this.dialog.draw(context)
        this.battleStage.draw(context)
        this.partyPage.draw(context)

    }

}