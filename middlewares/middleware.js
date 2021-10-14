const bcrypt = require('bcrypt')

const middleware = {}
middleware.authorization = (req, res, next) => {
    let user = req.session.user
    if(user){
        next()
    }else{
        res.redirect('http://localhost:3000/login')
    }
}

middleware.pagenotfound = (req, res, next) => {
    var err = new Error('Page not found')
    err.status = 404
    
    res.status(err.status || 500)
    res.send(err.message)
}

middleware.logger = (req, res, next) => {
    console.log('host: ', req.hostname)
    console.log('path: ', req.path)
    console.log('method: ', req.method)
    console.log('body: ', req.body)
    next()
}

middleware.crypt = (req, res, next) => {
    var pwd = req.body.password
    req.body.password = bcrypt.hashSync(pwd,10)
    next()
}

middleware.nullrequest = (req, res, next) => {

}

module.exports = middleware