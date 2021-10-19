const express = require('express')
const router = express.Router()
const middleware = require('../../middlewares/middleware')

router.get('/', middleware.getactive)
router.post('/', middleware.find)
router.get('/viewuser/:id', middleware.viewuser)
router.get('/login', middleware.formlogin)
router.post('/login', middleware.finduser, middleware.login)

router.use(middleware.authorization)

router.get('/logout', middleware.logout)
router.get('/adduser', middleware.formadd)
router.post('/adduser', middleware.checkrequest, middleware.requestTime, middleware.crypt, middleware.create)
router.get('/edituser/:id', middleware.formedit)
router.post('/edituser/:id',middleware.checkrequest, middleware.requestTime, middleware.update)
router.get('/deleteuser/:id', middleware.delete)


  
module.exports = router