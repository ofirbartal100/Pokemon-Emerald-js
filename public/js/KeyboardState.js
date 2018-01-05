const PRESSED = 1
const RELEASED = 0

export default class KeyboardState {
    constructor() {
        //holds the current state of a given key
        this.keyStates = new Map()

        //holds the callback functions for a key code
        this.keyMap = new Map()
    }

    addMapping(code, callback) {
        this.keyMap.set(code, callback)
    }

    handleEvent(event) {
        const { code } = event
        if (!this.keyMap.has(code)) {
            // did have key mapped
            return false
        }
        event.preventDefault()
        const keyState = event.type === 'keydown' ? PRESSED : RELEASED
        if (this.keyStates.get(code) === keyState) {
            return
        }
        this.keyStates.set(code, keyState)
        this.keyMap.get(code)(keyState)
    }

    listenTo(window) {
        ['keydown', 'keyup'].forEach(eventName => {
            window.addEventListener(eventName, event => {
                this.handleEvent(event)
            })
        })
    }
}