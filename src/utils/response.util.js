
const sendSuccess = (res, data = null, message = 'Thành công', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        data: data
    });
};

const sendError = (res, message = 'Đã có lỗi xảy ra', statusCode = 400, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message: message,
        errors: errors
    });
};

// Xuất khẩu 2 hộp công cụ này ra để các Controller sử dụng
module.exports = {
    sendSuccess,
    sendError
};