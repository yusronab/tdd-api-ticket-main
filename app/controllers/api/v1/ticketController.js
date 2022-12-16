const ticketService = require("../../../services/ticketService")

module.exports = {
    async create(req, res) {
        const stringFlight = req.body.flight.toUpperCase()
        const stringYear = new Date(req.body.takeOff).getFullYear().toString().slice(-2)
        const takeDate = new Date(req.body.takeOff).getDate()
        const arriveDate = new Date(req.body.arrive).getDate()
        const countUser = await ticketService.counting()
        const getCount = countUser.toString().length == 3 ? countUser.toString() : countUser.toString().length == 2 ? "0" + countUser.toString() : "00" + countUser.toString()
        const getTakeDates = takeDate.toString().length == 2 ? takeDate.toString() : "0" + takeDate.toString()
        const getArriveDates = arriveDate.toString().length == 2 ? arriveDate.toString() : "0" + arriveDate.toString()
        
        const customCode = stringFlight.slice(0,2)+ stringYear + "TO" + getTakeDates + "AR" + getArriveDates + getCount

        const body = {
            ...req.body,
            flight: stringFlight,
            code: customCode
        }

        ticketService.create(body)
            .then((ticket) => {
                res.status(201).json({
                    status: "CREATED",
                    data: ticket
                })
            })
            .catch((err) => {
                res.status(400).json({
                    status: "BAD REQUEST",
                    errors: err.message
                })
            })
    },

    list(req, res) {
        ticketService.list()
            .then(({ data }) => {
                res.status(200).json({
                    status: "OK",
                    data: { tickets: data }
                })
            })
            .catch((err) => {
                res.status(401).json({
                    status: "FAIL",
                    errors: err.message
                })
            })
    },

    update(req, res) {
        ticketService.update(req.params.id, req.body)
            .then(() => {
                res.status(200).json({ message: "Update Successfully" })
            })
            .catch((err) => {
                res.status(401).json({
                    status: "FAIL",
                    errors: err.message
                })
            })
    },

    destroy(req, res) {
        ticketService.delete(req.params.id)
            .then(() => {
                res.status(204).end()
            })
            .catch((err) => {
                res.status(401).json({
                    status: "FAIL",
                    errors: err.message
                })
            })
    },

    get(req, res) {
        ticketService.get(req.params.id)
            .then((ticket) => {
                res.status(200).json({
                    status: "OK",
                    data: ticket
                })
            })
            .catch((err) => {
                res.status(401).json({
                    status: "FAIL",
                    errors: err.message
                })
            })
    },

    listDoms(req, res) {
        ticketService.ticketDom()
            .then((tickets) => {
                res.status(200).json({
                    status: "OK",
                    data: { tickets }
                })
            })
            .catch((err) => {
                res.status(422).json({
                    status: "FAIL",
                    errors: err.message
                })
            })
    },

    listIntr(req, res) {
        ticketService.ticketIntr()
            .then((tickets) => {
                res.status(200).json({
                    status: "OK",
                    data: { tickets }
                })
            })
            .catch((err) => {
                res.status(422).json({
                    status: "FAIL",
                    errors: err.message
                })
            })
    }
}