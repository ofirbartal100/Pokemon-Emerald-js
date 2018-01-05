export default class Compositor {
    constructor() {
        this.layers = []
    }

    draw(context, camera) {
    	let overlay, menu
        this.layers.forEach(({name,draw}) => {
        	if(name == 'overlay')
        		overlay = draw
            else if (name == 'menu')
                menu = draw
            else
                draw(context, camera)
        })
        if(overlay)
        	overlay(context,camera)
        if(menu)
            menu(context)
    }
}