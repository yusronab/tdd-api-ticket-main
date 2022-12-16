const transService = require("../../../services/transService")
const ticketService = require("../../../services/ticketService")
const notifyService = require("../../../services/notifyService")

module.exports = {
    async create(req, res) {
        const ticketId = req.params.ticketId

        const isAvailable = await transService.chairAvailable(ticketId, req.body.numChair)

        if (isAvailable) {
            res.status(401).json({ message: "This seet are available" })
            return
        }

        const ticket = await ticketService.get(ticketId)

        if (!ticket) {
            res.status(401).json({ message: "Invalid ticket" })
            return
        }
        
        const ticketCode = ticket.dataValues.code

        const userId = req.user.id

        const transCounter = await transService.transCounter()

        const userString = userId.toString().length == 3 ? userId.toString() : userId.toString().length == 2 ? "0" + userId.toString() : "00" + userId.toString()
        const ticketString = ticketId.toString().length == 3 ? ticketId.toString() : ticketId.toString().length == 2 ? "0" + ticketId.toString() : "00" + ticketId.toString()
        const transString = transCounter.toString().length == 3 ? transCounter.toString() : transCounter.toString().length == 2 ? "0" + transCounter.toString() : "00" + transCounter.toString()

        const customCode = userString + ticketString + ticket.dataValues.departureCode + ticket.dataValues.destinationCode + transString

        const body = {
            ...req.body,
            ticketId: ticketId,
            ticketCode: ticketCode,
            userId: userId,
            isPaid: false,
            notCancelled: true,
            code: customCode
        }

        transService.create(body)
            .then((transaction) => {
                const payload = {
                    desc: `Anda telah melakukan pemesanan ticket dengan kode pemesanan: ${transaction.code}, segera lakukan pembayaran.`,
                    userId: userId,
                    isRead: false,
                    type: "INFO"
                }

                notifyService.create(payload)
                    .then((notify) => {
                        res.status(201).json({
                            status: "CREATED",
                            data: notify
                        })
                    })
                    .catch((err) => {
                        res.status(400).json({
                            status: "SENDING NOTIFY FAIL",
                            errors: err.message
                        })
                    })

            })
            .catch((err) => {
                res.status(400).json({
                    status: "TRANSACTION FAIL",
                    errors: err.message
                })
            })

    },

    list(req, res) {
        transService.list()
            .then(({ data }) => {
                res.status(200).json({
                    status: "OK",
                    data: { transaction: data }
                })
            })
            .catch((err) => {
                res.status(401).json({
                    status: "FAIL",
                    errors: err.message
                })
            })
    },

    history(req, res) {
        const id = req.user.id

        transService.userHistory(id)
            .then((transaction) => {
                res.status(200).json({
                    status: "OK",
                    data: { transaction }
                })
            })
    },

    payingTrans(req, res) {
        transService.payingTrans(req.params.transId)
            .then(async () => {
                const transaction = await transService.get(req.params.transId)

                const payload = {
                    desc: `Terimakasih, anda telah melakukan pembayaran dengan kode pemesanan: ${transaction.code}.`,
                    userId: transaction.userId,
                    isRead: false,
                    type: "INFO"
                }

                notifyService.create(payload)
                    .then((notify) => {
                        res.status(201).json({
                            status: "CREATED",
                            data: notify
                        })
                    })
                    .catch((err) => {
                        res.status(400).json({
                            status: "SENDING NOTIFY FAIL",
                            errors: err.message
                        })
                    })
            })
            .catch((err) => {
                res.status(401).json({
                    status: "FAIL",
                    errors: err.message
                })
            })
    },

    cancelTrans(req, res) {
        transService.cancelTrans(req.params.transId)
            .then(async () => {
                const transaction = await transService.get(req.params.transId)

                const payload = {
                    desc: `Anda telah membatalkan atau menyelesaikan pemesanan dengan kode pemesanan: ${transaction.code}.`,
                    userId: transaction.userId,
                    isRead: false,
                    type: "INFO"
                }

                notifyService.create(payload)
                    .then((notify) => {
                        res.status(201).json({
                            status: "CREATED",
                            data: notify
                        })
                    })
                    .catch((err) => {
                        res.status(400).json({
                            status: "SENDING NOTIFY FAIL",
                            errors: err.message
                        })
                    })
            })
            .catch((err) => {
                res.status(401).json({
                    status: "FAIL",
                    errors: err.message
                })
            })
    }
}