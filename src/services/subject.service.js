const { Subject } = require("../models/index.model");

// Tạo Subject mới cho user, chưa có hạn chót (DeadLine = null)
async function taoSubject(ten, loaiMau, userId) {
  const tenDaCat = typeof ten === "string" ? ten.trim() : "";
  if (!tenDaCat) {
    throw new Error("Thiếu tên Subject");
  }
  if (tenDaCat.length > 30) {
    throw new Error("Tên Subject tối đa 30 ký tự");
  }
  // LoaiMau là TINYINT trong DB -> số nguyên 0..255
  const mau = Number(loaiMau);
  if (!Number.isInteger(mau) || mau < 0 || mau > 255) {
    throw new Error("loaiMau phải là số nguyên từ 0 đến 255");
  }

  const subject = await Subject.create({
    IdUser: userId,
    Ten: tenDaCat,
    LoaiMau: mau,
  });
  return { idSubject: subject.IdSubject };
}

module.exports = { taoSubject };
