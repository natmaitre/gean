const express = require('express')
const app = express()
const port = process.env.PORT || 80

app.use(express.static('public'))

app.listen(port, () => {

})
