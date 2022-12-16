const userService = require("../../../services/userService")

const cloudinary = require("../../upload/cloudinary")

const { User } = require("../../../models")

module.exports = {
    list(req, res) {
        if (req.user.role === "member") {
            res.status(401).json({ message: `Role ${req.user.role} is not allowed here` })
            return
        }

        userService.list()
            .then(({ data }) => {
                res.status(200).json({
                    status: "OK",
                    data: { user: data }
                })
            })
            .catch((err) => {
                res.status(401).json({
                    status: "FAIL",
                    errors: err.message
                })
            })
    },

    detail(req, res) {
        if (req.user.role === "member") {
            res.status(401).json({ message: `Role ${req.user.role} is not allowed here` })
            return
        }

        userService.get(req.params.id)
            .then((user) => {
                res.status(200).json({
                    status: "OK",
                    data: user
                })
            })
            .catch((err) => {
                res.status(422).json({
                    status: "FAIL",
                    errors: err.message
                })
            })
    },

    async destroy(req, res) {
        if (req.user.role !== "superadmin") {
            res.status(401).json({ message: `Role ${req.user.role} is not allowed here` })
            return
        }

        const user = await userService.get(req.params.id)

        if (!user) {
            res.status(422).json({ message: "Invalid user" })
            return
        }

        const userImage = user.dataValues.image

        if (userImage) {
            const imageID = userImage.split("/").pop().split(".")[0]

            const deleteImage = await cloudinary.uploader.destroy(`user/${imageID}`)

            if (!deleteImage) {
                res.status(422).json({ message: "Error when deleting file" })
                return
            }
        }

        userService.delete(req.params.id)
            .then(() => {
                res.status(204).end()
            })
            .catch((err) => {
                res.status(422).json({
                    status: "FAIL",
                    errors: err.message
                })
            })
    },

    async update(req, res) {
        if (req.user.role !== "superadmin") {
            res.status(401).json({ message: `Role ${req.user.role} is not allowed here` })
            return
        }

        if (req.file == null) {
            userService.update(req.params.id, req.body)
                .then(() => {
                    res.status(200).json({ message: "Update successfully" })
                })
                .catch((err) => {
                    res.status(422).json({
                        status: "FAIL",
                        errors: err.message
                    })
                })
        } else {
            const user = await userService.get(req.params.id)

            const userImage = user.dataValues.image

            if (userImage !== null) {
                const imageID = userImage.split("/").pop().split(".")[0]

                await cloudinary.uploader.destroy(`user/${imageID}`)
            }

            const fileBase64 = req.file.buffer.toString("base64")
            const file = `data:${req.file.mimetype};base64,${fileBase64}`

            cloudinary.uploader.upload(file, { folder: 'user' }, function (err, result) {
                if (!!err) {
                    res.status(400).json({
                        status: "UPLOAD FAIL",
                        errors: err.message
                    })
                    return
                }

                const body = {
                    ...req.body,
                    image: result.url
                }

                userService.update(req.params.id, body)
                    .then(() => {
                        res.status(200).json({ message: "Update successfully" })
                    })
                    .catch((err) => {
                        res.status(400).json({
                            status: "FAIL",
                            errors: err.message
                        })
                    })
            })
        }
    }
}