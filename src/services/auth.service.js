// khai báo thư viện bcrypt
const bcrypt = require("bcrypt");
// khai báo util
const { taoToken } = require("../utils/jwt.util");
// khai báo database
const User = require("../models/user.model");
//Hàm đăng ký
async function register(hoTen, email, password) {
  const tonTaiUser = await User.findOne({ where: { Email: email } });
  if (tonTaiUser) {
    throw new Error("Email đã tồn tại");
  }
  // số 10 giá trị độ phức tạp của mảng băm
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    HoTen: hoTen,
    Email: email,
    Password_Hash: passwordHash,
    HoatDongLanCuoi: new Date(),
    HoatDongGanNhat: new Date(),
  });
  return newUser;
}
// Hàm đăng nhập
async function login(email, password) {
  const user = await User.scope("withPassword").findOne({
    where: { Email: email },
  });
  if (!user) {
    throw new Error("Email không đúng");
  }
  const isMatch = await bcrypt.compare(password, user.Password_Hash);
  if (!isMatch) {
    throw new Error("Mật khẩu không đúng");
  }
  const token = taoToken({ userId: user.IdUser });
  return { token };
}
module.exports = { register, login };
