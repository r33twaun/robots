const express = require('express')
const app = express()

const client = require('./db/client.js')
client.connect()

const PORT = 8080
app.listen(PORT, () => console.log(`listening on port ${PORT}`))