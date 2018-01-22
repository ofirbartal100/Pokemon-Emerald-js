import DataBase from '../DataBase.js'
import { loadJSON, loadImage } from './spriteSheet.js'


export function loadDataBase(db) {
    let database
    if (db) {
        database = db
    } else {
        database = new DataBase()
    }
    return Promise.all([
        loadJSON(`/pokemon/moves.json`),
        loadJSON(`/pokemon/types.json`),
        Promise.all([
            loadImage(`/img/battle-arenas/grass.png`),
            loadImage(`/img/battle-arenas/land.png`),
        ])
    ]).then(([moves, types, areas]) => {
        for (let move of moves) {
            database.moves.set(move.InternalName, move)
        }
        for (let type of types) {
            database.typeTable.set(type.InternalName, type)
        }
        let areaNames = ['grass', 'land']
        for (let i = 0; i < areas.length; i++) {
            database.areas.set(areaNames[i], areas[i])
        }
        return database
    })
}