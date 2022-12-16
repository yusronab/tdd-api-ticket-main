const ticketRepository = require("../repositories/ticketRepository")

module.exports = {
    create(requestBody) {
        return ticketRepository.create(requestBody)
    },

    update(id, requestBody) {
        return ticketRepository.update(id, requestBody)
    },

    delete(id) {
        return ticketRepository.delete(id)
    },

    get(id) {
        return ticketRepository.find(id)
    },

    async list() {
        try {
            const tickets = await ticketRepository.findAll()

            return {
                data: tickets
            }
        } catch (err) {
            throw err
        }
    },

    counting() {
        return ticketRepository.count()
    },

    ticketDom() {
        return ticketRepository.domesctic()
    },

    ticketIntr() {
        return ticketRepository.international()
    }
}