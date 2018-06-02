require('dotenv').config()
const debug = require('debug')('starter:index')
const path = require('path')
const morgan = require('morgan')
const express = require('express')

var app = express()
app.set('env', process.env.NODE_ENV)
const morganLogPreset = app.get('env') === 'development' ? 'dev' : 'combined'
app.use(morgan(morganLogPreset))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// AWS status endpoint
app.get('/status', function (req, res, next) {
  res.send('ok')
})

// Static server
app.use(express.static(path.join(__dirname, 'public')))

// Render index.pug
app.get('/', function (req, res, next) {
  res.render('index')
})

// Not found handler
app.use(function (req, res, next) {
  res.sendStatus(404)
})

// Error handlers
app.use(function (err, req, res, next) {
  debug('error handler', err)
  if (!res.statusCode) {
    res.status(500)
  }
  if (app.get('env') === 'development') {
    return res.send(err.toString())
  }
  res.end()
})

if (require.main === module) {
  const host = process.env.HOST || 'localhost'
  const port = process.env.PORT || 8080
  app.listen(port, host, () => {
    debug(`listening on ${host}:${port}`)
  })
}

module.exports = app
