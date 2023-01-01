const notifyRepository = require("../repositories/notifyRepository")

module.exports = {
    create(requestBody) {
        return notifyRepository.create(requestBody)
    },

    async list() {
        try {
            const notify = await notifyRepository.findAll()

            return {
                data: notify
            }
        } catch (err) {
            throw err
        }
    },

    userNotify(id) {
        return notifyRepository.findNotify(id)
    },

    updateReading(id) {
        return notifyRepository.updateReading(id)
    },

    deleteNotify(id) {
        return notifyRepository.destroyNotify(id)
    }
}