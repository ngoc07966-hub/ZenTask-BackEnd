// gọi thư viện express (1)
const express = require('express')
// khởi tạo trạm điều hướng (2)
const router = express.Router()
// gọi các đường dẫn  (3)
const auth = require('../routes/auth.routes')
//sử dụng các đường dần (4)
router.use('/auth', auth)
if (process.env.AUTH_ONLY !== '1') {
    const home = require('../routes/home.routes')
    const inputfile = require('../routes/inputfile.routes')
    const lichhoc = require('../routes/lichhoc.routes')
    router.use('/home', home)
    router.use('/input', inputfile)
    router.use('/schedule', lichhoc)
}

// đóng gói dữ liệu
module.exports = router
