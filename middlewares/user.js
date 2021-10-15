const connection = require('../connection')
const bcrypt = require('bcrypt')

function User() {}

User.prototype = {
    getactive: function (callback) {
        let sql = `SELECT * FROM user WHERE status = "active"`
        connection.query(sql, (err, rows) => {
            callback(err, rows)
        })
    },

    viewuser: function (id, callback) {
        let sql = `SELECT * FROM user WHERE id = ?`
        connection.query(sql, id, (err, rows) => {
            callback(err, rows)
        })
    },

    find: function (searchTerm, callback) {
        let sql = `SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?`
        connection.query(sql, ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
            callback(err, rows)
        })
    },

    finduser: function (username = null, callback) {
        let sql = `SELECT * FROM user WHERE last_name = ?`

        connection.query(sql, username, function (err, result) {
            callback(err, result)
        })
    },

    login: function (user, password, callback) {

        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                callback(user)
                return
            }
        }
        callback(null)
    },

    create: function (body, callback) {
        var bind = []
        for (prop in body) {
            bind.push(body[prop])
        }
        let sql = `INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?, password = ?`
        connection.query(sql, bind, function (err, result) {
            callback(err, result)
        })
    },

    update: function (body, id, callback) {
        var bind = []
        for (prop in body) {
            bind.push(body[prop])
        }
        let sql = `UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ${id}`
        connection.query(sql, bind, function (err, result) {
            callback(err, result)
        })
    },

    delete: function (id, callback) {
        let sql = `UPDATE user SET status = ? WHERE id = ${id}`
        connection.query(sql, 'removed', function (err, result) {
            callback(err, result)
        })
    },

}

module.exports = User