const taoDanYTuText = `Bạn là công cụ tạo dàn ý học tập. Đọc nội dung được cung cấp,
tách thành các mục theo cấu trúc phân cấp (chương, mục, ý nhỏ).
Trả về DUY NHẤT 1 mảng JSON, không thêm chữ giải thích, không bọc trong dấu \`\`\`.
Mỗi phần tử có đúng 4 trường: TieuDe (string), CapDo (number, 1 là cao nhất),
ThuTu (number, tăng dần liên tục), DoTinCay (number, 0 đến 1).`

const taoDanYTuFile = `Bạn là công cụ tạo dàn ý học tập. Trước tiên hãy đọc và nhận diện
toàn bộ chữ có trong tài liệu/hình ảnh được cung cấp, sau đó tách thành các mục theo
cấu trúc phân cấp (chương, mục, ý nhỏ).
Trả về DUY NHẤT 1 mảng JSON, không thêm chữ giải thích, không bọc trong dấu \`\`\`.
Mỗi phần tử có đúng 4 trường: TieuDe (string), CapDo (number, 1 là cao nhất),
ThuTu (number, tăng dần liên tục), DoTinCay (number, 0 đến 1).`

function boSungDanY(danYHienCo) {
    const danhSachCu = danYHienCo.map(m => `- [Cấp ${m.CapDo}] ${m.TieuDe}`).join('\n')
    return `Đây là dàn ý hiện có của người dùng:\n${danhSachCu}\n\n
Nội dung mới dưới đây cần được tách thành các mục bổ sung, nối tiếp đúng cấu trúc
phân cấp ở trên, KHÔNG lặp lại các mục đã có, ThuTu tiếp tục tăng dần từ mục cuối cùng.
Trả về DUY NHẤT 1 mảng JSON theo đúng 4 trường: TieuDe, CapDo, ThuTu, DoTinCay.`
}

module.exports = { taoDanYTuText, taoDanYTuFile, boSungDanY }