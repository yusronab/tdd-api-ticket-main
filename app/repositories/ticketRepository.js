const { Ticket, transaction } = require("../models")

module.exports = {
    create(createArgs) {
        return Ticket.create(createArgs)
    },

    update(id, updateArgs) {
        return Ticket.update(updateArgs, { where: { id } })
    },

    delete(id) {
        return Ticket.destroy({ where: { id } })
    },

    find(id) {
        return Ticket.findByPk(id, {
            include: [
                {
                    model: transaction,
                    as: 'bookingBy',
                    attributes: ['userId', 'numChair'],
                    required: false,
                    where: { isPaid: true, notCancelled: true }
                }
            ]
        })
    },

    findAll() {
        return Ticket.findAll({
            order: [
                ['updatedAt', 'DESC']
            ]
        })
    },

    count() {
        return Ticket.count()
    },

    domesctic() {
        return Ticket.findAll({ where: { flight: "DOMESTIC" } })
    },

    international() {
        return Ticket.findAll({ where: { flight: "INTERNATIONAL" } })
    },
}