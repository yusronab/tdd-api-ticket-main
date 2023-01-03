const transService = require("../../../services/transService")
const ticketService = require("../../../services/ticketService")
const notifyService = require("../../../services/notifyService")

const generateTransactionCode = async (userId, ticket) => {
    const transCounter = await transService.transCounter()
    const data = ticket.dataValues

    const userString = userId.toString().length == 3 ? userId.toString() : userId.toString().length == 2 ? "0" + userId.toString() : "00" + userId.toString()
    const ticketString = data.id.toString().length == 3 ? data.id.toString() : data.id.toString().length == 2 ? "0" + data.id.toString() : "00" + data.id.toString()
    const transString = transCounter.toString().length == 3 ? transCounter.toString() : transCounter.toString().length == 2 ? "0" + transCounter.toString() : "00" + transCounter.toString()

    const code = userString + ticketString + data.departureCode + data.destinationCode + transString

    return code;
}

module.exports = {
    async create(req, res) {
        const ticketId = req.params.ticketId

        const isAvailable = await transService.chairAvailable(ticketId, req.body.numChair)

        if (isAvailable) {
            res.status(400).json({ message: `Seat number ${req.body.numChair} has already been reserved` })
            return
        }

        const ticket = await ticketService.get(ticketId)

        if (!ticket) {
            res.status(401).json({ message: "Invalid ticket" })
            return
        }

        const userId = req.user.id

        // booking return ticket
        if (req.body.returnTicketId) {
            const returnTicketId = req.body.returnTicketId ? req.body.returnTicketId : ""
            const returnTicketChair = req.body.returnTicketChair ? req.body.returnTicketChair : ""

            if (returnTicketId === "" || returnTicketChair === "") {
                res.status(400).json({ message: `Checking return ticket at Id: ${returnTicketId || "Empty"} or Chair: ${returnTicketChair || "Empty"}` })
                return
            }

            const returnTicket = await ticketService.get(returnTicketId)

            if (!returnTicket) {
                res.status(401).json({ message: "Invalid return ticket" })
                return
            }

            const returnAvailable = await transService.chairAvailable(returnTicketId, returnTicketChair)

            if (returnAvailable) {
                res.status(400).json({ message: `Seat number ${returnTicketChair} has already been reserved (return)` })
                return
            }

            const requestBody = {
                ticketCode: returnTicket.code,
                ticketId: returnTicketId,
                userId: userId,
                isPaid: false,
                notCancelled: true,
                numChair: returnTicketChair,
                orderBy: req.body.orderBy,
                ktp: req.body.ktp,
                date: returnTicket.takeOff,
                code: await generateTransactionCode(userId, returnTicket)
            }

            const returnTicketTransaction = await transService.create(requestBody)

            if (!returnTicketTransaction) {
                res.status(401).json({ message: "Error when booking second ticket" })
                return
            }

            const payload = {
                desc: `Anda telah melakukan pemesanan ticket dengan kode pemesanan: ${returnTicket.code}, segera lakukan pembayaran.`,
                userId: userId,
                isRead: false,
                type: "INFO"
            }

            notifyService.create(payload)
        }
        // booking current ticket
        const ticketCode = ticket.dataValues.code

        const body = {
            ticketId: ticketId,
            ticketCode: ticketCode,
            userId: userId,
            isPaid: false,
            notCancelled: true,
            numChair: req.body.numChair,
            orderBy: req.body.orderBy,
            ktp: req.body.ktp,
            date: ticket.takeOff,
            code: await generateTransactionCode(userId, ticket)
        }

        transService.create(body)
            .then(async (transaction) => {
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
    },

    destroyTransc(req, res) {
        const id = req.params.transId

        if (!id) {
            res.status(401).json({ message: "Invalid transaction" })
            return
        }

        transService.delete(id)
            .then(() => {
                res.status(204).end()
            })
            .catch((err) => {
                res.status(400).json({
                    status: "FAIL",
                    errors: err.message
                })
            })
    }
}