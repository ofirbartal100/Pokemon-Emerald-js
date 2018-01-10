import Camera from './Camera.js'
import Timer from './Timer.js'
import Menu from './Menu.js'
import Dialog from './Dialog.js'
import BattleStage from './BattleStage.js'

export default class Game {
    constructor() {
        this.camera = new Camera()
        this.menu = new Menu()
        this.dialog = new Dialog()
        this.battleStage = new BattleStage()
        this.timer = new Timer(1 / 60)
        this.location = null
        this.player = null
    }

    setPlayer(trainer) {
        if (this.location) {
            this.player = trainer
            const self = this

            this.player.warp = function warpToLocation(location) {
                const game = self
                if (game.location.neighbors && game.location.neighbors.neighborsMap.has(location)) {
                    const warpLocation = game.location.neighbors.locationsMap.get(location)
                    const fromLocation = game.location.name
                    game.location.next(warpLocation,fromLocation)
                    let portals = game.location.tileCollider.tiles.searchByType("portal")
                    for (let portal of portals) {
                        if (portal.portal == fromLocation) {
                            trainer.move(portal.x*16, portal.y*16)
                        }
                    }
                }
            }

            this.player.battle = function pokemonEncount(battle){
                const game = self
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
    }

    draw(context) {
        if (this.location) {
            this.location.focus(this.camera, this.player)
            this.location.comp.draw(context, this.camera)
        }
        this.menu.draw(context)
        this.dialog.draw(context)
        this.battleStage.draw(context)
    }

}