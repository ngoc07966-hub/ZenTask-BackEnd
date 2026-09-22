const lichhocService = require('../services/lichhoc.service')

async function taoLich(req, res) {
    try {
        const { idSubject } = req.params
        const ketQua = await lichhocService.taoLich(idSubject, req.userId)
        res.json({ success: true, data: ketQua })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

async function xemLich(req, res) {
    try {
        const { ngay } = req.params
        const danhSach = await lichhocService.xemLich(ngay, req.userId)
        res.json({ success: true, data: danhSach })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

async function danhDauHoanThanh(req, res) {
    try {
        const { idDanY } = req.params
        const ketQua = await lichhocService.danhDauHoanThanh(idDanY, req.userId)
        res.json({ success: true, data: ketQua })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

module.exports = { taoLich, xemLich, danhDauHoanThanh }