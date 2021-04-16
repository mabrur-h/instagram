const { Router } = require('express')
const UserMiddleware = require('../middlewares/UserMiddleware')

const router = Router()


router.get('/', UserMiddleware, (request, response) => {
    response.render('index', {
        title: "Home Page"
    })
})


module.exports = {
    path: "/",
    router: router
}
