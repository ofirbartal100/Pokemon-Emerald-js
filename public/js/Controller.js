import { Commands } from './input.js'
import { Vec2 } from './math.js'

export default class Controller {
    constructor() {

    }

    move(direction, state) {
        if (!state) {
            return
        }
        if (direction == 'ArrowUp') {
        	this.up()
        } else if (direction == 'ArrowDown') {

        	this.down()
        } else if (direction == 'ArrowRight') {

        	this.right()
        } else if (direction == 'ArrowLeft') {

        	this.left()
        }
    }

    action(command, state) {
        if (!state) {
            return
        }
        if (command == Commands[0]) {
        	this.a()
        } else if (command == Commands[1]) { //b
        	this.b()
        } else if (command == Commands[2]) { //start
        	this.start()
        }
    }

    // Interface
    up(){

    }

    down(){

    }

    left(){

    }

    right(){

    }

    a(){

    }

    b(){

    }

    start(){
    	
    }
}