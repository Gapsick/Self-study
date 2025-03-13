const db = require('../config/db');

const getUserById = async (id) => {
  const [users] = await db.query(`SELECT * FROM users WHERE id = ?`, [id]);
  return users[0] || null;
};

const createUser = async (user) => {
  await db.query(
    `INSERT INTO users (id, email, name, student_id, year, role, profile_picture, approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [user.id, user.email, user.name, user.studentId, user.year, "student", user.picture, false]
  );
};

const approveUser = async (email) => {
  await db.query(`UPDATE users SET approved = TRUE WHERE email = ?`, [email]);
};

const setUserRole = async (email, role) => {
  await db.query(`UPDATE users SET role = ? WHERE email = ?`, [role, email]);
};

module.exports = { getUserById, createUser, approveUser, setUserRole };
