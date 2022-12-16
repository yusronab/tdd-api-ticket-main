const userRepository = require("../repositories/userRepository")

module.exports = {
    create(requestBody) {
        return userRepository.create(requestBody)
    },

    update(id, requestBody) {
        return userRepository.update(id, requestBody)
    },

    delete(id) {
        return userRepository.delete(id)
    },

    get(id) {
        return userRepository.find(id)
    },

    async list() {
        try {
            const users = await userRepository.findAll()

            return {
                data: users
            }
        } catch (err) {
            throw err
        }
    }
}