// kiểu datatypes kiểu dữ liệu
const { DataTypes, Model } = require("sequelize");
// kết nối database
const { sequelize } = require("../config/db");
// Khai báo bảng
class Subject extends Model {}

Subject.init(
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
      field: "SoMucHoanThanh",
    },
  },
  {
    sequelize, // bắt buộc — truyền kết nối vào ngay đây
    modelName: "Subject", // bắt buộc — thay cho tham số đầu của define()
    tableName: "Subjects",
    timestamps: false,
  },
);
module.exports = Subject;
