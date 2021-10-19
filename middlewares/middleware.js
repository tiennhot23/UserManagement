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
    console.log('start middleware crypt')
    console.log('Password trước khi mã hoá: ', req.body.password)
    var pwd = req.body.password
    req.body.password = bcrypt.hashSync(pwd, 10)
    console.log('Password sau khi mã hoá: ', req.body.password)
    next()
}


middleware.checkrequest = (req, res, next) => {
    if(req.body.first_name.trim().length == 0){
        next(new Error("First Name không được trống"))
        return
    }
    if(req.body.last_name.trim().length == 0){
        next(new Error("Last Name không được trống"))
        return
    }
    if(req.body.email.trim().length == 0){
        next(new Error("Email không được trống"))
        return
    }
    if(req.body.phone.trim().length == 0){
        next(new Error("Phone không được trống"))
        return
    }
    if(req.body.password.trim().length == 0){
        next(new Error("Password không được trống"))
        return
    }
    if(!validateEmail(req.body.email)){
        next(new Error("Email sai định dạng"))
        return
    }
    if(!validatePhone(req.body.phone)){
        next(new Error("Phone sai định dạng"))
        return
    }
}

middleware.requestTime = (err, req, res, next) => {
    if(err){
        if(req.path.includes('adduser')){
            res.redirect('/adduser?e=' + encodeURIComponent(err.message))
        }
        if(req.path.includes('edituser')){
            res.redirect(`/edituser/${req.params.id}?e=` + encodeURIComponent(err.message))
        }
        return
    }
    console.log('start middleware requestTime')
    req.requestTime = new Date(Date.now()).toString()
    console.log('Time: ', req.requestTime)
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
        if (!users[0]){
            res.render('login', {
                alert: `Username invalid`
            })
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

middleware.formedit = (req, res, next) => {
    let e = req.query.e
    user.viewuser(req.params.id, function (err, rows) {
        if (rows) {
            res.render('edit-user', {
                alert: e,
                rows
            })
        } else {
            res.render('edit-user', {
                alert: 'Invalid user'
            })
        }
    })
}

middleware.formadd = (req, res, next) => {
    let e = req.query.e
    res.render('add-user', {
        alert: e
    })
}

middleware.formlogin = (req, res, next) => {
    res.render('login')
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
    console.log('start middleware create')
    if(req.body.comments){
        req.body.comments = req.body.comments + `\nThis comment is created at ${req.requestTime}`
    }
    console.log('Nội dung cuối cùng của request: ', req.body)
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
    if(req.body.comments){
        req.body.comments = req.body.comments + `\nThis comment is created at ${req.requestTime}`
    }
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
            let removedUser = encodeURIComponent('User successeflly removed.')
            res.redirect('/?removed=' + removedUser)
        } else {
            console.log(err)
            res.render('404')
        }
    })
}

function validateEmail(email) {
    const reg = /^[a-z][a-z0-9]+@[a-z]+(\.[a-z]{2,4}){1,2}$/
    return reg.test(String(email).toLowerCase())
}

function validatePhone(phone) {
    const reg = /^[0][0-9]{9}$/
    return reg.test(String(phone))
}

module.exports = middleware