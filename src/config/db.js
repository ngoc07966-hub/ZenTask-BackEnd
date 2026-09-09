const { Sequelize } = require("sequelize");
const { DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME, DB_INSTANCE } = require('./env');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_SERVER,
    dialect: 'mssql',
    dialectOptions: {
        options: {
            instanceName: DB_INSTANCE,
            encrypt: false,             // Để false khi test ở máy local
            trustServerCertificate: true // Bắt buộc để tránh lỗi chứng chỉ SSL
        }
    },
    logging: false // tắt log SQL Sequelize tự in ra console mỗi query
});

async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('Đã kết nối Database thành công');
    } catch (error) {
        console.log('Kết nối Database thất bại:', error);
        process.exit(1);
    }
}

module.exports = { connectDB, sequelize };