const connection = require('../../connection')

exports.form = (req, res) => {
  res.render('add-user')
}

exports.edit = (req, res) => {
  connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      if (rows) {
        res.render('edit-user', {
          rows
        })
      } else {
        res.render('edit-user', {
          alert: 'Invalid user'
        })
      }
    } else {
      console.log(err)
    }
  })
}

exports.formlogin = (req, res) => {
  res.render('login')
}