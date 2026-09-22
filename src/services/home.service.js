const { User, Subject, DanY } = require("../models/index.model");

async function gethomeService(UserId) {
  const userPromise = User.findByPk(UserId);
  const subjectsPromise = Subject.findAll({ where: { IdUser: UserId } });
  // Lấy 5 mục DanY hoàn thành gần nhất, CHỈ của đúng user này
  // (lọc qua include vì bảng DanY không có sẵn cột IdUser, chỉ có IdSubject)
  const recentActivitiesPromise = DanY.findAll({
    where: { TrangThaiHoanThanh: true },
    order: [["NgayHoanThanh", "DESC"]],
    limit: 5,
    include: [
      {
        model: Subject,
        where: { IdUser: UserId },
        attributes: ["Ten"], // chỉ lấy tên Subject, không cần cả bản ghi
      },
    ],
  });

  const [user, subjects, recentActivities] = await Promise.all([
    userPromise,
    subjectsPromise,
    recentActivitiesPromise,
  ]);

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

  return {
    streak: user.ChuoiHienTai,
    subjects: tienDo,
    recentActivities: recentActivities.map((danY) => danY.toJSON()),
  };
}

module.exports = { gethomeService };