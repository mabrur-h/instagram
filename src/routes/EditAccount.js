const { Router } = require('express')
const UserMiddleware = require('../middlewares/UserMiddleware')
const AuthMiddleware = require('../middlewares/AuthMiddleware')
const fsSync = require('fs')
const path = require('path')
const { updateProfile, findUser } = require('../models/UserModel')

const router = Router()


router.use(UserMiddleware)


router.get('/edit', UserMiddleware, async (request, response) => {
    const photoPath = path.join(__dirname, "..", "public", "img", "avatar", `${request.user._id}.jpg`)
    let isExist = fsSync.existsSync(photoPath)
    let user = await findUser(request.user.username)
    response.render('editAccount', {
        title: "Edit account",
        photo: isExist,
        user
    })
})


router.post('/edit', AuthMiddleware, async (request, response) => {
    try {
        let data = await request.body
        let name = data.name
        let website = data.website
        let about = data.about
        let update = await updateProfile(request.user._id, name, website, about)
        response.redirect('/')
    }
    catch(e){
        response.render('editAccount', {
            title: "Edit Account",
            error: e + "",
        })
    }
})

module.exports = {
    path: "/accounts",
    router: router
}
