import Camera from './Camera.js'
import Timer from './Timer.js'
import Menu from './Menu.js'
import Dialog from './Dialog.js'
import PartyPage from './PartyPage.js'
import BagPage from './BagPage.js'
import BattleStage from './BattleStage.js'
import DataBase from './DataBase.js'

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

    setPlayer(trainer) {
        if (this.location) {
            this.player = trainer
            const self = this
            this.menu.player = this.player
            this.partyPage.party = this.player.party
            this.menu.pokemonsAction = function(state){
                self.partyPage.active = state 
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
                const game = self
                battle.init(self.dataBase.getPokemon(battle.pokemonID))
                game.battleStage.battle = battle
                game.battleStage.active = true
                this.inBattle = true
                console.log(battle)
            }
            this.location.entities.add(this.player)
        }
    }

    update(deltaTime) {
        if (this.location) {
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