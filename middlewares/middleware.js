const bcrypt = require('bcrypt')
const connection = require('../connection')
const User = require('./user')

const user = new User();

const middleware = {}
middleware.authorization = (req, res, next) => {
    let user = req.session.user
    if (user) {
        next()
    } else {
        res.redirect('http://localhost:3000/login')
    }
}

middleware.pagenotfound = (req, res, next) => {
    res.render('404')
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
    req.body.password = bcrypt.hashSync(pwd, 10)
    next()
}


middleware.nullrequest = (req, res, next) => {

}

middleware.requestTime = (req, res, next) => {
    req.resquestTime = Date.now()
    next()
}



middleware.find = (req, res, next) => {
    user.find(req.body.search, function (err, rows) {
        if (!err) {
            res.render('home', {
                rows
            })
        } else {
            res.render('404')
        }
    })
}

middleware.finduser = (req, res, next) => {
    user.finduser(req.body.username, function (err, users) {
        if (err) {
            res.render('404')
            return
        }
        req.user = users[0]
        next()
    })
}

middleware.viewuser = (req, res, next) => {
    user.viewuser(req.params.id, function (err, rows) {
        if (!err) {
            res.render('view-user', {
                rows
            })
        } else {
            res.render('404')
        }
    })
}

middleware.login = (req, res, next) => {
    user.login(req.user, req.body.password, function (user) {
        if (user) {
            req.session.user = user
            res.redirect('/')
        } else {
            res.render('login', {
                alert: `Username or password incorrect.`
            })
        }
    })
}

middleware.logout = (req, res, next) => {
    if (req.session.user) {
        req.session.destroy(function () {
            res.redirect('/')
        })
    }
}

middleware.edit = (req, res, next) => {
    user.viewuser(req.params.id, function (err, rows) {
        if (rows) {
            res.render('edit-user', {
                rows
            })
        } else {
            res.render('edit-user', {
                alert: 'Invalid user'
            })
        }
    })
}

middleware.getactive = (req, res, next) => {
    user.getactive(function (err, rows) {
        if (!err) {
            let removedUser = req.query.removed
            res.render('home', {
                rows,
                removedUser
            })
        } else {
            res.render('404')
        }
    })
}

middleware.create = (req, res, next) => {
    user.create(req.body, function (err, rows) {
        if (!err) {
            res.render('add-user', {
                alert: 'User added successfully.'
            })
        } else {
            res.render('404')
        }
    })
}

middleware.update = (req, res, next) => {
    user.update(req.body, req.params.id, function (err, rows) {
        if (!err) {
            res.render('edit-user', {
                alert: 'User update successfully.'
            })
        } else {
            res.render('404')
        }
    })
}

middleware.delete = (req, res, next) => {
    user.delete(req.params.id, function (err, rows) {
        if (!err) {
            if (rows) {
                res.render('home', {
                    alert: 'Invalid user'
                })
            } else {
                let removedUser = encodeURIComponent('User successeflly removed.')
                res.redirect('/?removed=' + removedUser)
            }

        } else {
            console.log(err)
            res.render('404')
        }
    })
}

module.exports = middleware