const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

async function uploadFile(fileBuffer, fileType) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: fileType === "pdf" ? "raw" : "image" },
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result.secure_url)
                }
            }
        )
        stream.end(fileBuffer)
    })
}

module.exports = { uploadFile }