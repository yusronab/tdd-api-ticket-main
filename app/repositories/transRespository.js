const { transaction, Ticket } = require("../models")
const { Op } = require("sequelize")

module.exports = {
    create(createArgs) {
        return transaction.create(createArgs)
    },

    delete(id) {
        return transaction.destroy({ where: { id } })
    },

    find(id) {
        return transaction.findByPk(id)
    },

    findAll() {
        return transaction.findAll({ order: [
            ["updatedAt", "DESC"]
        ] })
    },

    checking(id, num) {
        return transaction.findOne({ where: {
            ticketId: id,
            numChair: num,
            notCancelled: true
        } })
    },

    booking(id) {
        return transaction.findAll({ 
            where: { userId: id },
            include: [
                {
                    model: Ticket,
                    as: 'ticket',
                }
            ],
            order: [
                ["updatedAt", "DESC"]
            ]
        })
    },

    paid(id) {
        return transaction.update({ isPaid: true }, { where: { id } })
    },

    cancel(id) {
        return transaction.update({ notCancelled: false }, { where: { id } })
    },

    counting() {
        return transaction.count()
    }
}