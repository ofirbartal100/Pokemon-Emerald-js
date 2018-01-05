export default class EntityCollider {
    constructor(entities) {
        this.entities = entities
    }

    check(subject) {
        this.entities.forEach(canditate => {
            if (subject === canditate) {
                return
            }
            if (subject.bounds.overlaps(canditate.bounds)) {
                subject.collides(canditate)
                canditate.collides(subject)
            }
        })
    }
}