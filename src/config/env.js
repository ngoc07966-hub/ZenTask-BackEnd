require("dotenv").config();
const PORT = process.env.PORT ? process.env.PORT.trim() : '3000';
const DB_SERVER = process.env.DB_SERVER ? process.env.DB_SERVER.trim() : '';
const DB_USER = process.env.DB_USER ? process.env.DB_USER.trim() : '';
const DB_INSTANCE = process.env.DB_INSTANCE ? process.env.DB_INSTANCE.trim() : '';
const DB_PASSWORD = process.env.DB_PASSWORD ? process.env.DB_PASSWORD.trim() : '';
const DB_NAME = process.env.DB_NAME ? process.env.DB_NAME.trim() : '';
if (!DB_SERVER || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error("Lỗi: Chưa cấu hình cho database trong file .env");
}
module.exports = {
  PORT,
  DB_SERVER,
  DB_USER,
  DB_INSTANCE,
  DB_PASSWORD,
  DB_NAME,
};
