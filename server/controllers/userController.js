const connection = require('../../connection')

exports.form = (req, res) => {
  res.render('add-user')
}

exports.formlogin = (req, res) => {
  res.render('login')
}