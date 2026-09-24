const subjectService = require("../services/subject.service");

async function taoSubject(req, res) {
  try {
    const { ten, loaiMau } = req.body;
    const ketQua = await subjectService.taoSubject(ten, loaiMau, req.userId);
    res.status(201).json({ success: true, data: ketQua });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = { taoSubject };
