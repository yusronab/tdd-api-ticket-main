const userService = require("../../../services/userService")

const cloudinary = require("../../upload/cloudinary")

const { User } = require("../../../models")

const { Op } = require("sequelize")
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const salt = 10

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'yusron.arly@gmail.com',
        pass: 'nbmhvzewnfdaohji'
    }
});

function encyptedPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, salt, (err, encryptedPassword) => {
            if (!!err) {
                reject(err)
                return
            }

            resolve(encryptedPassword)
        })
    })
}

function checkPassword(encryptedPassword, password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, encryptedPassword, (err, isPasswordCorrect) => {
            if (!!err) {
                reject(err)
                return
            }

            resolve(isPasswordCorrect)
        })
    })
}

function createToken(payload) {
    return jwt.sign(payload, process.env.JWT_SIGNATURE_KEY || "Rahasia")
}

module.exports = {
    async whoIsLogin(req, res, next) {
        try {
            const bearerToken = req.headers.authorization
            console.log("token =>", bearerToken);
            const token = bearerToken.split(" ")[1]
            const tokenPayload = jwt.verify(token, process.env.JWT_SIGNATURE_KEY || "Rahasia")

            req.user = await User.findByPk(tokenPayload.id)
            
            next()
        } catch (err) {
            res.status(401).json({
                status: "UNAUTHORIZED",
                errors: err.message
            })
        }
    },

    currentUser(req, res) {
        res.status(200).json(req.user)
    },

    async login(req, res) {
        const email = req.body.email ? req.body.email.toLowerCase() : ""
        const password = req.body.password ? req.body.password : ""

        if (email === "" || password === "") {
            res.status(404).json({ message: "Email or password cannot empty" })
            return
        }

        const user = await User.findOne({
            where: {
                [Op.and]: [
                    {
                        email: email
                    },
                    {
                        isExist: true
                    }
                ]
            }
        })

        if (!user) {
            res.status(404).json({ message: "User not found" })
            return
        }

        const isPasswordCorrect = await checkPassword(user.password, password)

        if (!isPasswordCorrect) {
            res.status(404).json({ message: "Password wrong" })
            return
        }

        const token = createToken({
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email
        })

        res.status(200).json({ token: token })
    },

    async register(req, res) {
        const email = req.body.email ? req.body.email.toLowerCase() : ""
        const password = req.body.password ? req.body.password : ""

        if (email === "" || password === "") {
            res.status(404).json({ message: "Email or password cannot empty" })
            return
        }

        const encryptedPassword = await encyptedPassword(password)

        const rolePicker = typeof req.user === 'undefined' ? "member" : req.user.role === "superadmin" ? "admin" : "member"

        const isEmailExists = await User.findOne({ where: { email: email, isExist: true } })

        if (isEmailExists) {
            res.status(400).json({ message: "This email already exists" })
            return
        }

        if (req.file == null) {
            const body = {
                ...req.body,
                email: email,
                role: rolePicker,
                isExist: true,
                isVerify: false,
                password: encryptedPassword
            }

            userService.create(body)
                .then((user) => {
                    res.status(201).json({
                        status: "CREATED",
                        data: user
                    })
                })
                .catch((err) => {
                    res.status(400).json({
                        status: "BAD REQUEST",
                        errors: err.message
                    })
                })
        } else {
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
                    email: email,
                    role: rolePicker,
                    isExist: true,
                    isVerify: false,
                    password: encryptedPassword,
                    image: result.url
                }

                userService.create(body)
                    .then((user) => {
                        res.status(201).json({
                            status: "CREATED",
                            data: user
                        })
                    })
                    .catch((err) => {
                        res.status(400).json({
                            status: "BAD REQUEST",
                            errors: err.message
                        })
                    })
            })
        }
    },

    async update(req, res) {
        if (req.file == null) {
            userService.update(req.user.id, req.body)
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
            const userImage = req.user.image

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

                userService.update(req.user.id, body)
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
    },

    async delete(req, res) {
        const dateDeleted = new Date()

        const body = {
            isExist: false,
            deletedAt: dateDeleted
        }

        userService.update(req.user.id, body)
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

    async forgorPassword(req, res) {
        const email = req.body.email.toLowerCase()

        const user = await User.findOne({ where: { email }, isExist: true })

        if (!user) {
            res.status(400).json({ message: "User email not exist" })
            return
        }

        const payload = {
            id: user.dataValues.id,
            password: user.dataValues.password,
        }

        jwt.sign(payload, process.env.JWT_SIGNATURE_KEY || "Rahasia", async (err, token) => {
            if (err) {
                console.log("error ==>", err.message)
                return
            }

            const url = `https://api-ticket.up.railway.app/reset-password/${token}`;

            transporter.sendMail({
                from: '"GarudaNih Team" <yusron.arly@gmail.com>',
                to: req.body.email,
                subject: 'Reset your Garudanih password',
                html: `
                <table width="100%" style="width: 100%">
                    <tbody>
                    <tr>
                        <td align="center">
                        <img src="https://res.cloudinary.com/dptgh7efj/image/upload/v1670225832/samples/Group_7194_ev6skd.png" style="width:250px; margin-bottom: 40px; margin-top: 40px" width="250px" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <table width="570" align="center">
                            <tbody>
                            <tr>
                                <td>
                                    <p style="font-size: 16px; color: black; margin-bottom: 30px">Someone (hopefully you) has requested a password reset for your GarudaNih account. Follow the link below to set a new password:</p>
                                    <a href="${url}" style="font-size: 16px; background-color: #2F82FF; border-radius: 10px; text-decoration: none; color: white; padding: 10px; cursor: pointer; margin-top: 30px;">Reset Password</a>
                                    <p style="font-size: 16px; color: black; margin-top: 30px">If you don't wish to reset your password, disregard this email and no action will be taken.</p>
                                    <p style="font-size: 16px; color: black; margin-top: 50px">Regards,</p>
                                    <p style="font-size: 16px; color: black;">GarudaNih Team</p>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
                `,
            });
        })

        res.status(200).json({ message: `Check ${email} for reset password` })
    },

    async viewsReset(req, res) {
        try {
            const token = req.params.token
            const tokenPayload = jwt.verify(token, process.env.JWT_SIGNATURE_KEY || "Rahasia")
            
            userService.get(tokenPayload.id)
                .then((user) => {
                    res.status(200).render('reset-password', {
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
        } catch (err) {
            res.status(401).json({
                status: "UNAUTHORIZED",
                errors: err.message
            })
        }
    },

    async resetPassword(req, res) {
        const id = req.body.id
        const password = req.body.password

        const user = await userService.get(id)

        const encryptedPassword = await encyptedPassword(password)

        if (!user) {
            res.status(401).render('response', {
                message: "User not found",
                color: "red"
            })
            return
        }
        
        if (password !== req.body.confirmPassword) {
            res.status(400).render('response', { 
                message: "Password doesn't match",
                color: "red"
            })
            return
        }

        userService.update(id, { password: encryptedPassword })
            .then(() => {
                res.status(200).render('response', {
                    message: "Reset password successfully",
                    color: "#2F82FF"
                })
            })
            .catch((err) => {
                res.status(401).render('response', {
                    message: err.message,
                    color: "red"
                })
            })
    }
}