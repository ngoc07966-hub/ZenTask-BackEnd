// khai báo các dữ liệu và kết nối với bảng
const User = require("./user.model");
const Subject = require("./subject.model");
const DanY = require("./dany.model");
// Thể hiện mối quan hệ các bảng
// Bảng User với Subject
User.hasMany(Subject, { foreignKey: "IdUser" });
Subject.belongsTo(User, { foreignKey: "IdUser" });
// Bảng Subject với Dàn ý
Subject.hasMany(DanY, { foreignKey: "IdSubject" });
DanY.belongsTo(Subject, { foreignKey: "IdSubject" });
// Quan hệ dàn ý với parent_Id
DanY.belongsTo(DanY, { as: "MucCha", foreignKey: "ParentId" });
DanY.hasMany(DanY, { as: "MucCon", foreignKey: "ParentId" });

module.exports = { User, Subject, DanY };
