const jwt = require('jsonwebtoken')

async function authmiddleware (req, res, next) {
    try {
        const authHeader = req.headers.authorization
        // kiểm tra xem token có rỗng hay không
        if(!authHeader){
            return res.status(401).json({success: false, message: 'Không có token'})
        }
        // loại bỏ bearer khỏi chuỗi token để JWT kiểm tra đoạn mã
        const token = authHeader.split(' ')[1]
        // JWT giải mã đoạn Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next()
    }catch (error) {
        res.status(401).json({ success: false, message: 'Token không hợp lệ' })
    }

}
module.exports = authmiddleware 