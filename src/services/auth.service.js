// khai báo thư viện bcrypt
const bcrypt = require("bcrypt");
// khai báo util
const jwt = require("../utils/jwt.util");
// khai báo database
const User = require("../models/user.model");
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
async function login(email, password) {
  const user = await User.scope("withPassword").findOne({
    where: { Email: email },
  });
  if (!user) {
    throw new Error("Email đã tồn tại");
  }
  const isMatch = await bcrypt.compare(password, user.Password_Hash);
  if (!isMatch) {
    throw new Error("Mật khẩu không đúng");
  }
  const token = jwt.sign({ userId: user.IdUser }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return { token };
}
