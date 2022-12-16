const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client("785137861913-jraaaegd6mhuunhiuntrpighacick6ea.apps.googleusercontent.com")

const salt = 10

const { User } = require("../../../models")

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
    async register(req, res) {
        const email = req.body.email ? req.body.email.toLowerCase() : ""
        const password = req.body.password ? req.body.password : ""

        if (email === "" || password === "") {
            res.status(404).json({ message: "Email or password cannot empty" })
            return
        }

        const encryptPassword = await encyptedPassword(password)

        const isEmailExists = await User.findOne({ where: { email }, isExist: true })

        if (isEmailExists) {
            res.status(400).json({ message: "This email already exist" })
            return
        }

        const user = await User.create({
            name: req.body.name,
            email: email,
            password: encryptPassword,
            role: "member",
            isExist: true,
            isVerify: false,
        })

        jwt.sign({ id: user.dataValues.id }, process.env.JWT_SIGNATURE_KEY || "Rahasia", async (err, emailToken) => {
            if (err) {
                console.log("error ==>", err.message)
                return
            }

            const url = `https://api-ticket.up.railway.app/v2/user/register-verify/${emailToken}`;

            transporter.sendMail({
                from: '"GarudaNih Team" <yusron.arly@gmail.com>',
                to: req.body.email,
                subject: 'Confirmation Account',
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
                                    <b style="font-size: 22px; color: black;">Hi ${req.body.name},</b>
                                    <p style="font-size: 16px; color: black; margin-bottom: 30px">Your registration is successfully, now you must verify account to activate this account. Please click button bellow to verify your account.</p>
                                    <a href="${url}" style="font-size: 16px; background-color: #2F82FF; border-radius: 10px; text-decoration: none; color: white; padding: 10px; cursor: pointer; margin-top: 30px;">Verify Account</a>
                                    <p style="font-size: 16px; color: black; margin-top: 30px">Thanks for your confirmation, now you can login using this email.</p>
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

        res.status(200).json({
            status: "CREATED",
            data: user
        })
    },

    async verifyAccount(req, res) {
        try {
            const user = jwt.verify(req.params.token, process.env.JWT_SIGNATURE_KEY || "Rahasia");

            const id = user.id

            await User.update({ isVerify: true }, { where: { id } })

            res.status(200).render('response', {
                message: "Yeay... your account has been veryfied",
                color: "#2F82FF"
            })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }

        return;
    },

    async login(req, res) {
        const email = req.body.email ? req.body.email.toLowerCase() : ""
        const password = req.body.password ? req.body.password : ""

        if (email === "" || password === "") {
            res.status(404).json({ message: "Email or password cannot empty" })
            return
        }

        const userNotVerify = await User.findOne({
            where: { email: email, isVerify: false }
        })

        if (userNotVerify) {
            res.status(404).json({ message: "Please verify your email" })
            return
        }

        const user = await User.findOne({
            where: { email: email, isExist: true }
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

    async googleLogin(req, res) {
        const { token } = req.body;

        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: "785137861913-jraaaegd6mhuunhiuntrpighacick6ea.apps.googleusercontent.com"
            })
            const { email, name, picture } = ticket.getPayload()

            let user = await User.findOne({ where: { email: email } });

            if (!user) user = await User.create({
                name: name,
                email: email,
                image: picture,
                role: "member",
                isExist: true,
                isVerify: true,
            });

            const accessToken = createToken({
                id: user.id,
                code: user.code,
                name: user.name,
                email: user.email
            });

            res.status(201).json({ token: accessToken });
        } catch (err) {
            res.status(401).json({ error: { name: err.name, message: err.message } });
        }
    }
}