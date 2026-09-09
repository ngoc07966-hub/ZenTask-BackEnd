const app = require('./app')
const {PORT} = require('./config/env')
const {connectDB} = require('./config/db')
async function startserver () {
    try {
        await connectDB()
        // Truyền PORT và thêm thông báo khi server chính thức mở cửa
    app.listen(PORT, () => {
        console.log(`Server đang chạy tại cổng http://localhost:${PORT}`);
    });
    } catch(error) {
        console.error('Không thể kết nối Server:',error)
        process.exit(1)//thoát khi gặp lỗi
    }
}
startserver()