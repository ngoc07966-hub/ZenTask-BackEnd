const { DanY, Subject, User } = require('../models/index.model')

// Kiểm tra Subject có thật sự thuộc về đúng user đang gọi không
async function kiemTraQuyenSubject(idSubject, userId) {
    const subject = await Subject.findOne({ where: { IdSubject: idSubject, IdUser: userId } })
    if (!subject) {
        throw new Error('Không tìm thấy Subject hoặc bạn không có quyền')
    }
    return subject
}

// Tính Streak khi có 1 mục vừa được đánh dấu hoàn thành
function tinhStreakMoi(user, homNay) {
    const hoatDongCu = user.HoatDongGanNhat
    if (!hoatDongCu) {
        return 1
    }
    const soNgayCach = Math.floor((homNay - new Date(hoatDongCu)) / (1000 * 60 * 60 * 24))
    if (soNgayCach === 0) {
        return user.ChuoiHienTai
    } else if (soNgayCach === 1) {
        return user.ChuoiHienTai + 1
    } else {
        return 1
    }
}

async function taoLich(idSubject, userId) {
    const subject = await kiemTraQuyenSubject(idSubject, userId)

    const danYChuaLenLich = await DanY.findAll({
        where: { IdSubject: idSubject, NgayLenLich: null },
        order: [['ThuTu', 'ASC']],
    })

    if (danYChuaLenLich.length === 0) {
        return []
    }

    const homNay = new Date()
    const deadline = new Date(subject.Deadline)
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