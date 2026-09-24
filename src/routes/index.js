const express = require('express')
const router = express.Router()
const auth = require('../routes/auth.routes')

router.use('/auth', auth)

if (process.env.AUTH_ONLY !== '1') {
    const home = require('../routes/home.routes')
    const inputfile = require('../routes/inputfile.routes')
    const lichhoc = require('../routes/lichhoc.routes')
    const subject = require('../routes/subject.routes')
    router.use('/home', home)
    router.use('/subject', subject)
    router.use('/input', inputfile)
    router.use('/lichhoc', lichhoc)
}

module.exports = router