const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const middleware = require('../../middlewares/middleware')

router.get('/', userController.view)
router.post('/', userController.find)
router.get('/viewuser/:id', userController.viewall)
router.get('/login', userController.formlogin)
router.post('/login', userController.login)

router.use(middleware.authorization)

router.get('/adduser', userController.form)
router.post('/adduser', middleware.crypt, userController.create)
router.get('/edituser/:id', userController.edit)
router.post('/edituser/:id', userController.update)
router.get('/deleteuser/:id', userController.delete)


  
module.exports = router