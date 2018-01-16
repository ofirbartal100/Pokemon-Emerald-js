import DataBase from '../DataBase.js'

export function loadDataBase() {
    const database = new DataBase()
    return Promise.all([
        database.loadMoves()
    ]).then(() => {
        return database
    })
}