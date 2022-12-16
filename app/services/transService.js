const transRepository = require("../repositories/transRespository")

module.exports = {
    create(requestBody) {
        return transRepository.create(requestBody)
    },

    delete(id) {
        return transRepository.delete(id)
    },

    get(id) {
        return transRepository.find(id)
    },

    async list() {
        try {
            const transactions = await transRepository.findAll()

            return {
                data: transactions
            }
        } catch (err) {
            throw err
        }
    },

    chairAvailable(id, num) {
        return transRepository.checking(id, num)
    },

    userHistory(token) {
        return transRepository.booking(token)
    },

    payingTrans(id) {
        return transRepository.paid(id)
    },

    cancelTrans(id) {
        return transRepository.cancel(id)
    },

    transCounter() {
        return transRepository.counting()
    }
}