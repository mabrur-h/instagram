const { Router } = require('express')
const UserMiddleware = require('../middlewares/UserMiddleware')
const upload = require('express-fileupload')
const fs = require('fs/promises')
const fsSync = require('fs')
const path = require('path')
const { findUser } = require('../models/UserModel')

const router = Router()


router.use(UserMiddleware)


router.get('/', UserMiddleware, async (request, response) => {
    const photoPath = path.join(__dirname, "..", "public", "img", "avatar", `${request.user._id}.jpg`)

    let user = await findUser(request.user.username)
    let isExist = fsSync.existsSync(photoPath)
    response.render('index', {
        title: "Home Page",
        photo: isExist,
        user: user
    })
    console.log (user)
})


router.post('/photo', upload({ size: (1024 * 10) * 1024 }), async (req, res) => {
    try {
        const photoPath = path.join(__dirname, "..", "public", "img", "avatar", `${req.user._id}.jpg`)
        const fileStream = await fs.writeFile(photoPath, req.files.photo.data)
        res.send({
            ok: true
        })
    } catch (e) {
        res.send({
            ok: false
        })
    }
})

module.exports = {
    path: "/profile",
    router: router
}
