import Controller from '../Controller.js'
import { Commands } from '../input.js'
import { Vec2 } from '../math.js'

export default class MenuController extends Controller {
    constructor(MenuPage) {
        super()
        this.menuRef = MenuPage
        this.menuCursor = 0

    }

    up() {
        let itemsNum = this.menuRef.items.length
        this.menuCursor = (this.menuCursor + (itemsNum - 1)) % itemsNum
    }

    down() {
        let itemsNum = this.menuRef.items.length
        this.menuCursor = (this.menuCursor + 1) % itemsNum
    }

    left() {

    }

    right() {

    }

    a() {
        this.choose(this.menuCursor)
    }

    b() {
        this.active = false
        
    }

    start() {

    }

    //unique methods
    choose(index) {
        this.chosenItem = this.menuRef.items[index]
        this.menuRef.routAction('init', true) //global
    }

}