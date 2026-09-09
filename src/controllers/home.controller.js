const homeService = require('../services/home.service')
async function getHome (req,res) {
    try{
        const userId = req.userId
        const data = await homeService.gethomeService(userId)
        res.json ({success: true, data: data})
    }catch(error) {
        res.status(500).json({success: false, message: error.message})
    }
}
module.exports = { getHome }