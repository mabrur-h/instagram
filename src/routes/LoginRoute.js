const { Router } = require('express')
const AuthMiddleware = require('../middlewares/AuthMiddleware')
const Joi = require('joi')
const { findUser } = require('../models/UserModel')
const { checkCrypt } = require('../modules/bcrypt')
const { generateJWTToken } = require('../modules/jwt')

const LoginValidation = Joi.object({
    login: Joi.string()
        .required()
        .alphanum()
        .error(new Error('Login is incorrect')),
    password: Joi.string()
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .error(new Error('Password is incorrect'))
})

const router = Router()

router.use(AuthMiddleware)

router.use(async (req, res, next) => {
    if ( req.user ) {
        res.redirect('/')
    }
    next()
})

router.get('/', (request, response) => {
    response.render('login', {
        title: "Login"
    })
})


router.post('/', async (req, res) => {
    try {
        let data = await LoginValidation.validateAsync(req.body)
        let phone_number = Number(data.login)
        let user
        if ( isNaN(phone_number) ) {
            user = await findUser(data.login)
        } else {
            user = await findUser(phone_number)
        }

        if ( !user ) {
            throw new Error('User not found!')
        }

        let isTrue = checkCrypt(data.password, user.password)

        if ( !isTrue ) {
            throw new Error('Password is incorrect!')
        }
        let token = generateJWTToken({
            _id: user._id,
            name: user.name,
            username: user.username,
        })
        res.cookie('token', token).redirect('/')
    } catch (e) {
        res.render('login', {
            title: "Login",
            error: e + ""
        })
    }
})


module.exports = {
    path: "/login",
    router: router
}
