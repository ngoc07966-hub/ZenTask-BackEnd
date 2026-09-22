const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");
class DanY extends Model {}
DanY.init(
  {
    IdDanY: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "IdDanY",
    },
    IdSubject: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "IdSubject",
    },
    // chứa dữ liệu của IdDanY (Cha)
    ParentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "ParentId",
    },
    TieuDe: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "TieuDe",
    },
    NoiDung: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "NoiDung",
    },
    ThuTu: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "ThuTu",
    },
    CapDo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "CapDo",
    },
    DoTinCay: {
      type: DataTypes.DECIMAL(4, 3),
      allowNull: false,
      field: "DoTinCay",
    },
    TrangThaiHoanThanh: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: "TrangThaiHoanThanh",
    },
    NgayNhap: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "NgayNhap",
    },
    NgayHoanThanh: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "NgayHoanThanh",
    },
    NgayLenLich: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "NgayLenLich",
    },
    NguonLoi: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "NguonLoi",
    },
  },
  {
    sequelize,
    modelName: "DanY",
    tableName: "DanY",
    timestamps: false,
  },
);

module.exports = DanY;
