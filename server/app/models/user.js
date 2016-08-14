const db = require('../database');

function loginWithPhone(phone, password, callback) {
  const queryString = 'SELECT id FROM user WHERE phone = ? AND password = ?';
  db.singleQuery(queryString, [phone, password], (err, user) => {
    if (err) return callback(err);
    return callback(null, user);
  });
}

function updateById(id, columns, callback) {
  db.singleQuery('UPDATE user SET ? WHERE id = ?', [columns, id], callback);
}

function findById(id, columns, callback) {
  db.singleQuery('SELECT ? FROM user WHERE id = ?', [columns, id], callback);
}

function register(user, callback) {
  db.singleQuery('INSERT INTO user ? VALUES ?', [user.keys(), user.values()], callback);
}

module.exports = {
  findById,
  loginWithPhone,
  register,
  updateById,
};