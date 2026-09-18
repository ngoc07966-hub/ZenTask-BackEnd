const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");
class User extends Model {}
  User.init(
  {
    IdUser: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // tương đương với biến Identity(1,1)
      field: "IdUser",
    },
    HoTen: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "HoTen",
    },
    Email: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: "Email",
    },
    Password_Hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "Password_Hash",
    },
    Avatar_Url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "Avatar_Url",
    },
    Ngay_Tao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "Ngay_Tao",
    },
    HoatDongLanCuoi: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "HoatDongLanCuoi",
    },
    ChuoiHienTai: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "ChuoiHienTai",
    },
    HoatDongGanNhat: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "HoatDongGanNhat",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
    timestamps: false, // tắt vì bảng không có CreatedAt/UpdatedAt tự động của Sequelize
    defaultScope: {
      attributes: { exclude: ["Password_Hash"] }, // ẩn mặc định, đúng Bước 5 đã bàn
    },
    scopes: {
      withPassword: { attributes: {} }, // dùng khi cần lấy đủ cột (lúc xử lý đăng nhập)
    },
  },
);
module.exports = User
