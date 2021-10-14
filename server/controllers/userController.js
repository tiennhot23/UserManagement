const connection = require('../../connection')
const bcrypt = require('bcrypt')
const User = require('../../middlewares/user')

const user = new User();


exports.view = (req, res) => {
  connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
    if (!err) {
      let removedUser = req.query.removed
      res.render('home', {
        rows,
        removedUser
      })
    } else {
      console.log(err)
    }
  })
}

exports.find = (req, res) => {
  let searchTerm = req.body.search
  connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
    if (!err) {
      res.render('home', {
        rows
      })
    } else {
      console.log(err)
    }
  })
}

exports.form = (req, res) => {
  res.render('add-user')
}

exports.create = (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    comments,
    password
  } = req.body

  console.log(req.body.password)

  connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?, password = ?', [first_name, last_name, email, phone, comments, password], (err, rows) => {
    if (!err) {
      res.render('add-user', {
        alert: 'User added successfully.'
      })
    } else {
      console.log(err)
    }
  })
}


exports.edit = (req, res) => {
  connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('edit-user', {
        rows
      })
    } else {
      console.log(err)
    }
  })
}


exports.update = (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    comments
  } = req.body
  connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {

    if (!err) {
      connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        if (!err) {
          res.render('edit-user', {
            rows,
            alert: `${first_name} has been updated.`
          })
        } else {
          console.log(err)
        }
      })
    } else {
      console.log(err)
    }
  })
}

exports.delete = (req, res) => {
  connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
    if (!err) {
      let removedUser = encodeURIComponent('User successeflly removed.')
      res.redirect('/?removed=' + removedUser)
    } else {
      console.log(err)
    }
  })
}

exports.viewall = (req, res) => {
  connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('view-user', {
        rows
      })
    } else {
      console.log(err)
    }
  })
}

exports.formlogin = (req, res) => {
  res.render('login')
}

exports.login = (req, res) => {
  console.log(req.body.password)
  user.login(req.body.username, req.body.password, function (result) {
    if (result) {
      req.session.user = result
      res.redirect('/')
    } else {
      res.render('login', {
        alert: `Username or password incorrect.`
      })
    }
  })
}

exports.formRegister = (req, res) => {
  res.render('register')
}

exports.register = (req, res) => {
  user.login(req.body.username, req.body.password, function (result) {
    if (result) {
      req.session.user = result;
      req.session.opp = 1;
      res.redirect('/home');
    } else {
      res.send('Username/Password incorrect!');
    }
  })
}