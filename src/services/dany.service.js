const { DanY, Subject } = require("../models/index.model");

async function luuCayVaoDB(flatItems, idSubject) {
    const kiemTraSubject = await Subject.findByPk(idSubject);
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

    const daLuu = await DanY.create({
      IdSubject: idSubject,
      ParentId: parentId,
      TieuDe: item.TieuDe,
      CapDo: item.CapDo,
      ThuTu: item.ThuTu,
      DoTinCay: item.DoTinCay,
    });

    stack.push(daLuu);
    ketQua.push(daLuu);
  }

  return ketQua;
}

module.exports = { luuCayVaoDB };
