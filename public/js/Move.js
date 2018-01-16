export default class Move {
    constructor(specs) {
        if(specs){
            this.name = specs.InternalName
        }
        else {
            this.name = 'Empty'
        }
    }
}