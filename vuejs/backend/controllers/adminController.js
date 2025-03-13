const { approveUser, setUserRole } = require('../models/userModel');

const approveUserController = async (req, res) => {
  try {
    const { email } = req.body;
    await approveUser(email);
    res.json({ success: true, message: `${email}의 승인이 완료되었습니다.` });
  } catch (error) {
    res.status(500).json({ message: '서버 오류', error: error.toString() });
  }
};

const setUserRoleController = async (req, res) => {
  try {
    const { email, role } = req.body;
    await setUserRole(email, role);
    res.json({ success: true, message: `${email}의 역할이 ${role}로 변경되었습니다.` });
  } catch (error) {
    res.status(500).json({ message: '서버 오류', error: error.toString() });
  }
};

module.exports = { approveUserController, setUserRoleController };
