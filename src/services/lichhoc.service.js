const { DanY, Subject, User } = require('../models/index.model')

// Kiểm tra Subject có thật sự thuộc về đúng user đang gọi không
async function kiemTraQuyenSubject(idSubject, userId) {
    const subject = await Subject.findOne({ where: { IdSubject: idSubject, IdUser: userId } })
    if (!subject) {
        throw new Error('Không tìm thấy Subject hoặc bạn không có quyền')
    }
    return subject
}

// Đổi Date (giờ địa phương) sang chuỗi 'YYYY-MM-DD' giống kiểu DATEONLY của Sequelize
function layChuoiNgay(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

// Số ngày chênh lệch giữa 2 chuỗi 'YYYY-MM-DD', bỏ qua phần giờ
function soNgayGiua(ngayCu, ngayMoi) {
    const [y1, m1, d1] = ngayCu.split('-').map(Number)
    const [y2, m2, d2] = ngayMoi.split('-').map(Number)
    return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / (1000 * 60 * 60 * 24))
}

// Tính Streak khi có 1 mục vừa được đánh dấu hoàn thành
function tinhStreakMoi(user, homNay) {
    const hoatDongCu = user.HoatDongGanNhat
    if (!hoatDongCu) {
        return 1
    }
    const ngayCu = hoatDongCu instanceof Date ? layChuoiNgay(hoatDongCu) : String(hoatDongCu).slice(0, 10)
    const soNgayCach = soNgayGiua(ngayCu, layChuoiNgay(homNay))
    if (soNgayCach === 0) {
        // User mới đăng ký có HoatDongGanNhat = hôm nay nhưng streak = 0 -> mục đầu tiên phải thành 1
        return Math.max(1, user.ChuoiHienTai)
    } else if (soNgayCach === 1) {
        return user.ChuoiHienTai + 1
    } else {
        return 1
    }
}

async function taoLich(idSubject, userId) {
    const subject = await kiemTraQuyenSubject(idSubject, userId)
    if (!subject.DeadLine) {
        throw new Error('Subject chưa có hạn chót, vui lòng đặt Deadline trước khi lên lịch')
    }

    const danYChuaLenLich = await DanY.findAll({
        where: { IdSubject: idSubject, NgayLenLich: null },
        order: [['ThuTu', 'ASC']],
    })

    if (danYChuaLenLich.length === 0) {
        return []
    }

    const homNay = new Date()
    const deadline = new Date(subject.DeadLine)
    const soNgay = Math.max(1, Math.ceil((deadline - homNay) / (1000 * 60 * 60 * 24)))
    const soMucMoiNgay = Math.ceil(danYChuaLenLich.length / soNgay)

    const ketQua = []
    for (let i = 0; i < danYChuaLenLich.length; i++) {
        const ngayThu = Math.floor(i / soMucMoiNgay)
        const ngayLenLich = new Date(homNay)
        ngayLenLich.setDate(homNay.getDate() + ngayThu)

        danYChuaLenLich[i].NgayLenLich = ngayLenLich
        await danYChuaLenLich[i].save()
        ketQua.push(danYChuaLenLich[i])
    }

    return ketQua
}

async function xemLich(ngay, userId) {
    const danhSach = await DanY.findAll({
        where: { NgayLenLich: ngay },
        include: [
            {
                model: Subject,
                where: { IdUser: userId },
                attributes: ['Ten'],
            },
        ],
        order: [['ThuTu', 'ASC']],
    })
    return danhSach.map(d => d.toJSON())
}

async function danhDauHoanThanh(idDanY, userId) {
    const danY = await DanY.findOne({
        where: { IdDanY: idDanY },
        include: [{ model: Subject, where: { IdUser: userId } }],
    })

    if (!danY) {
        throw new Error('Không tìm thấy mục này hoặc bạn không có quyền')
    }

    if (danY.TrangThaiHoanThanh) {
        throw new Error('Mục này đã được đánh dấu hoàn thành trước đó')
    }

    const homNay = new Date()

    danY.TrangThaiHoanThanh = true
    danY.NgayHoanThanh = homNay
    await danY.save()

    await Subject.increment('SoMucHoanThanh', { by: 1, where: { IdSubject: danY.IdSubject } })

    const user = await User.findByPk(userId)
    const streakMoi = tinhStreakMoi(user, homNay)
    user.ChuoiHienTai = streakMoi
    user.HoatDongGanNhat = homNay
    await user.save()

    return danY.toJSON()
}

module.exports = { taoLich, xemLich, danhDauHoanThanh }