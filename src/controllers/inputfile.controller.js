const { DanY, Subject } = require("../models/index.model");
const { uploadFile } = require("../services/storage.service");
const { xuLyTuFile, xuLyTuText } = require("../services/ai.service");
const { trichXuatText } = require("../utils/pdf.util");
const { luuCayVaoDB } = require("../services/dany.service");

async function process(req, res) {
  try {
    const { idSubject } = req.body;
    const file = req.file;

    if (!idSubject) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu idSubject" });
    }
    if (!file) {
      return res.status(400).json({ success: false, message: "Thiếu file" });
    }

    const isPdf = file.mimetype.includes("pdf");
    let flatItems;

    if (isPdf) {
      const text = await trichXuatText(file.buffer);
      const duChu = text && text.length > 50;

      if (duChu) {
        // PDF có sẵn chữ -> gửi thẳng text cho AI, không cần upload cloud
        flatItems = await xuLyTuText(text);
      } else {
        // PDF dạng scan -> vẫn cần upload + để AI tự OCR
        const fileUrl = await uploadFile(file.buffer, "pdf");
        flatItems = await xuLyTuFile(fileUrl, "pdf");
      }
    } else {
      // Ảnh -> luôn cần upload rồi để AI đọc
      const fileUrl = await uploadFile(file.buffer, "image");
      flatItems = await xuLyTuFile(fileUrl, "image");
    }

    // Lưu toàn bộ mảng phẳng vào DanY, tự dựng quan hệ ParentId theo CapDo
    const saved = await luuCayVaoDB(flatItems, idSubject);

    // Cập nhật lại TongSoMuc trên Subject cho khớp số mục vừa thêm
    await Subject.increment("TongSoMuc", {
      by: saved.length,
      where: { IdSubject: idSubject },
    });

    res.json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { process };
