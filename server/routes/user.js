const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const middleware = require('../../middlewares/middleware')

router.get('/', middleware.getactive)
router.post('/', middleware.find)
router.get('/viewuser/:id', middleware.viewuser)
router.get('/login', userController.formlogin)
router.post('/login', middleware.finduser, middleware.login)

router.use(middleware.authorization)

router.get('/logout', middleware.logout)
router.get('/adduser', userController.form)
router.post('/adduser', middleware.crypt, middleware.create)
router.get('/edituser/:id', middleware.edit)
router.post('/edituser/:id', middleware.update)
router.get('/deleteuser/:id', middleware.delete)


  
module.exports = router