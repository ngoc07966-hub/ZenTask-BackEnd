// kiểu datatypes kiểu dữ liệu
const { DataTypes } = require("sequelize");
// kết nối database
const { sequelize } = require("../config/db");
// Khai báo bảng
const Subject = sequelize.define(
  "Subject",
  {
    IdSubject: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "IdSubject",
    },
    IdUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "IdUser",
    },
    LoaiMau: {
      type: DataTypes.TINYINT,
      allowNull: false,
      field: "LoaiMau",
    },
    Ten: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "Ten",
    },
    DeadLine: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "Deadline",
    },
    TongSoMuc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "TongSoMuc",
    },
    SoMucHoanThanh: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "SoMucHoanThanh"
    },
  },
  {
    tableName: "Subjects",
    timestamps: false,
  },
);
module.exports = Subject