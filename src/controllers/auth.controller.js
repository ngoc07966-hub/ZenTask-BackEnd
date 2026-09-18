const authService = require("../services/auth.service");
async function register(req, res) {
  try {
    const { hoten, email, password } = req.body;
    const newUser = await authService.register(hoten, email, password);
    res.json({ success: true, data: newUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const xacthuc = await authService.login(email, password);
    res.json({ success: true, data: xacthuc });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
module.exports = { register, login };
