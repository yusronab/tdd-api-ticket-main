const { Notify } = require("../models")

module.exports = {
    create(createArgs) {
        return Notify.create(createArgs)
    },

    findAll() {
        return Notify.findAll({ order: [
            ['updatedAt', 'DESC']
        ] })
    },

    findNotify(id) {
        return Notify.findAll({
            where: { userId: id },
            order: [
                ['updatedAt', 'DESC']
            ]
        })
    },

    updateReading(id) {
        return Notify.update({ isRead: true }, { where: { id: id } })
    },

    destroyNotify(id) {
        return Notify.destroy({ where: { id } })
    }
}