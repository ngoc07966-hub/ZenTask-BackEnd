const { User, Subject } = require("../models/index.model");
async function gethomeService(UserId) {
  const userPromise = User.findByPk(UserId);
  const subjectsPromise = Subject.findAll({ where: { IdUser: UserId } });
  const [user, subjects] = await Promise.all([userPromise, subjectsPromise]);
  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }
  const tienDo = subjects.map((sj) => {
    const phanTram =
      sj.TongSoMuc > 0
        ? Math.round((sj.SoMucHoanThanh / sj.TongSoMuc) * 100)
        : 0;
    return { ...sj.toJSON(), PhanTram: phanTram };
  });
  const recentActivities = [...tienDo]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5);

    return { 
        streak: user.ChuoiHienTai, 
        subjects: tienDo, 
        recentActivities: recentActivities 
    };
}
module.exports = { gethomeService };
