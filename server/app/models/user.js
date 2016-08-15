const db = require('../database');

function findById(id, columns) {
  const queryString = 'SELECT ? FROM user WHERE id = ?';
  return db.query(queryString, [columns, id]);
}

function loginWithPhone(phone, password) {
  const queryString = 'SELECT id FROM user WHERE phone = ? AND password = ?';
  return db.query(queryString, [phone, password]);
}

function register(user) {
  const queryString = 'INSERT INTO user ? VALUES ?';
  return db.query(queryString, [user.keys(), user.values()]);
}

function updateById(id, columns) {
  const queryString = 'UPDATE user SET ? WHERE id = ?';
  return db.query(queryString, [columns, id]);
}

module.exports = {
  findById,
  loginWithPhone,
  register,
  updateById,
};