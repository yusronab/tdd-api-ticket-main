const { Ticket, transaction, Wishlist } = require("../models")

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
                    where: { notCancelled: true }
                }
            ],
            order: [ [{ model: transaction, as: 'bookingBy' }, 'numChair', 'ASC'] ],
        })
    },

    takeAroundFilter(filterArgs) {
        return Ticket.findAll({
            where: filterArgs,
            include: [
                {
                    model: transaction,
                    as: 'bookingBy',
                    attributes: ['userId', 'numChair'],
                    required: false,
                    where: { notCancelled: true }
                }
            ],
            order: [ [{ model: transaction, as: 'bookingBy' }, 'numChair', 'ASC'] ],
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
        return Ticket.findAll({ 
            where: { flight: "DOMESTIC" },
            order: [
                ['updatedAt', 'DESC']
            ]
        })
    },

    international() {
        return Ticket.findAll({
            where: { flight: "INTERNATIONAL" },
            order: [
                ['updatedAt', 'DESC']
            ]
        })
    },

    userWishlist(userId) {
        return Wishlist.findAll({
            where: { userId },
            include: [
                {
                    model: Ticket,
                    as: 'detailTicket',
                }
            ],
            order: [
                ["updatedAt", "DESC"]
            ]
        })
    },

    addWishlist(createArgs) {
        return Wishlist.create(createArgs)
    },

    destroyWishlist(id) {
        return Wishlist.destroy({ where: { id } })
    }
}