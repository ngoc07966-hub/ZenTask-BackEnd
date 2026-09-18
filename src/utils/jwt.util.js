const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'chuoi_bi_mat_mac_dinh'
// payload: dữ liệu muốn dấu thẻ; exporesIn: thời hạn của Token
// nhận các dữ liệu token
const taoToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn })
};
const  giaimaToken = (token) => {
    try {
        // jwt.verify sẽ đối chiếu chữ ký và trả về payload gốc nếu hợp lệ
        return jwt.verify(token,JWT_SECRET)
    }catch(error){
        throw new Error('Token không hợp lệ hoặc đã hết hạn');
    }
};
module.exports = {
    taoToken,
    giaimaToken
};
