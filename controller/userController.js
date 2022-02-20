const repository = require('../repository/userRepository')
const crypto = require("crypto-js");

class ProductController {
    registerUser(req, res, next) {
        const password = crypto.AES.encrypt(req.body.password, process.env.SECRET)
        repository.registerUser(req.body, password)
        res.sendStatus(201)
    }

    login(req, res, next) {
        const email = req.body.email

        repository.getUserFromEmail(email, (user) => {
            if (!user) {
                res.send({
                    is_success: false,
                    error_message: "Wrong email and password combination.",
                    user: null
                })
                return
            }
            const decryptedPassword = crypto.AES.decrypt(user.password, process.env.SECRET)
                .toString(crypto.enc.Utf8)
            
            if (decryptedPassword != req.body.password) {
                res.send({
                    is_success: false,
                    error_message: "Wrong email and password combination.",
                    user: null
                })
                return
            }

            res.send({
                is_success: true,
                user: {
                    firstName: user.fisrt_name,
                    lastName: user.last_name,
                    isStaff: user.is_staff == 1,
                    email: user.email
                }
            })
        })
    }
}

module.exports = new ProductController()