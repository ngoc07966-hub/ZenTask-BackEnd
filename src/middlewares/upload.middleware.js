const multer = require('multer')
 
const MIME_CHO_PHEP = ['application/pdf', 'image/jpeg', 'image/png'];
 
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (MIME_CHO_PHEP.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Chỉ hỗ trợ file PDF, JPG, PNG'));
  },
});
 
module.exports = upload;
