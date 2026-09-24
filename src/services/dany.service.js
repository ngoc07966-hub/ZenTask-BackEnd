const { DanY, Subject } = require("../models/index.model");
const { sequelize } = require("../config/db");

// Lưu mảng phẳng vào DanY trong 1 transaction:
// lỗi giữa chừng thì không mục nào được lưu và TongSoMuc giữ nguyên
async function luuCayVaoDB(flatItems, idSubject) {
  return sequelize.transaction(async (t) => {
    const kiemTraSubject = await Subject.findByPk(idSubject, { transaction: t });
    if (!kiemTraSubject) {
      throw new Error("Chủ đề này không tồn tại, vui lòng kiểm tra lại!");
    }
    const stack = [];
    const ketQua = [];

    for (const item of flatItems) {
      while (stack.length && stack[stack.length - 1].CapDo >= item.CapDo) {
        stack.pop();
      }

      const parentId = stack.length ? stack[stack.length - 1].IdDanY : null;

      const daLuu = await DanY.create(
        {
          IdSubject: idSubject,
          ParentId: parentId,
          TieuDe: item.TieuDe,
          CapDo: item.CapDo,
          ThuTu: item.ThuTu,
          DoTinCay: item.DoTinCay,
        },
        { transaction: t },
      );

      stack.push(daLuu);
      ketQua.push(daLuu);
    }

    // Cập nhật lại TongSoMuc trên Subject cho khớp số mục vừa thêm
    await Subject.increment("TongSoMuc", {
      by: ketQua.length,
      where: { IdSubject: idSubject },
      transaction: t,
    });

    return ketQua;
  });
}

module.exports = { luuCayVaoDB };
