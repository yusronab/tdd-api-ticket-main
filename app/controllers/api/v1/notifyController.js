const notifyService = require("../../../services/notifyService")

module.exports = {
    list(req, res) {
        notifyService.list()
            .then(({ data }) => {
                res.status(200).json({
                    status: "OK",
                    data: { notify: data }
                })
            })
            .catch((err) => {
                res.status(400).json({
                    status: "FAIL",
                    errors: err.message
                })
            })
    },

    userNotify(req, res) {
        const userId = req.user.id

        notifyService.userNotify(userId)
            .then((notify) => {
                res.status(200).json({
                    status: "OK",
                    data: notify
                })
            })
            .catch((err) => {
                res.status(401).json({
                    status: "FAIL",
                    errors: err.message
                })
            })
    },

    updateReading(req, res) {
        notifyService.updateReading(req.params.id)
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

    deleteNotify(req, res) {
        const id = req.params.notifyId

        if (!id) {
            res.status(401).json({ message: "Invalid notification" })
            return
        }

        notifyService.deleteNotify(id)
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