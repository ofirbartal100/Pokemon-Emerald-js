import { loadBrendan } from './entities/brendan.js'
import { loadNPC } from './entities/NPC.js'

export function loadEntities() {
    const entityFactories = {}

    const NPCs = ['mom', 'fatBoy', 'pinkBoy', 'hatBoy']
    const loadNPCs = []
    NPCs.forEach(name => {
        loadNPCs.push(loadNPC(name).then(addAs(name)))
    })

    function addAs(name) {
        return factory => entityFactories[name] = factory
    }

    return Promise.all([
        loadBrendan().then(addAs('brendan')),
        ...loadNPCs
    ]).then(() => entityFactories)
}