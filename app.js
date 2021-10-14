const express = require('express')
const exphbs = require('express-handlebars')
const routes = require('./server/routes/user')
const middleware = require('./middlewares/middleware')
const session = require('express-session')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({extended: true}))

app.use(express.json())

app.use(express.static('public'))

app.engine('hbs', exphbs( {extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
    secret:'this is secret key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
}))

app.use(middleware.logger)

app.use('/', routes)

app.use(middleware.pagenotfound)

app.listen(port, () => console.log(`Listening on port ${port}`))