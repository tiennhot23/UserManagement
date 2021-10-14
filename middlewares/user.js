const connection = require('../connection')
const bcrypt = require('bcrypt')

function User() {}

User.prototype = {
    find : function(username = null, callback)
    {
        let sql = `SELECT * FROM user WHERE last_name LIKE ?`

        connection.query(sql, username, function(err, result) {
            if(err) throw err

            if(result.length) {
                callback(result[0])
            }else {
                callback(null)
            }
        })
    },

    // This function will insert data into the database. (create a new user)
    // body is an object 
    create : function(body, callback) 
    {

        var pwd = body.password
        // Hash the password before insert it into the database.
        body.password = bcrypt.hashSync(pwd,10)

        // this array will contain the values of the fields.
        var bind = []
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body){
            bind.push(body[prop])
        }
        // prepare the sql query
        let sql = `INSERT INTO users(username, fullname, password) VALUES (?, ?, ?)`
        // call the query give it the sql string and the values (bind array)
        db.query(sql, bind, function(err, result) {
            if(err) throw err
            // return the last inserted id. if there is no error
            callback(result.insertId)
        })
    },

    login : function(username, password, callback)
    {
        this.find(username, function(user) {
            if(user) {
                if(bcrypt.compareSync(password, user.password)) {
                    callback(user)
                    return
                }  
            }
            callback(null)
        })
    }

}

module.exports = User