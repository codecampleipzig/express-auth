const bcrypt = require('bcrypt')

exports.hashPassword = async function (password) {
  return bcrypt.hash(password, 10)
}

exports.checkPassword = async function (unhashedPassword, hashedPassword) {
  return bcrypt.compare(unhashedPassword, hashedPassword)
}

exports.ApiError = class ApiError extends Error {
  constructor (msg, status) {
    super(msg)
    this.status = status
  }
}
