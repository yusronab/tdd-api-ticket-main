const { Notify, transaction } = require("../../../models")
const Sequelize = require('sequelize');

module.exports = {
    updateExpiredPayments() {
        const criteria = {
            date: {
                [Sequelize.Op.lt]: new Date(),
            },
            notCancelled: true,
        };

        const newValues = {
            notCancelled: false,
        };

        transaction.update(newValues, { where: criteria, individualHooks: true })
            .then((result) => {
                
                const findAllCriteria = {
                    id: {
                        [Sequelize.Op.in]: result[1].map((r) => r.id),
                    },
                };

                transaction.findAll({ where: findAllCriteria })
                    .then((payments) => {
                        payments.forEach((payment) => {
                            Notify.create({
                                userId: payment.userId,
                                desc: `Transaksi dengan kode: ${payment.code} telah dibatalkan oleh sistem`,
                                isRead: false,
                                type: 'INFO'
                            })
                                .then(() => {
                                    console.log(`Notification created for user: ${payment.userId}`)
                                })
                                .catch((err) => {
                                    console.log('Error creating notification', err);
                                })
                        });
                    })
                    .catch((err) => {
                        console.log('Error fetching updated payments', err);
                    });
            })
            .catch((err) => {
                console.log('Error updating payments', err);
            });
    }
}