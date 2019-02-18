// error messages for the client

class UserError extends Error {}

UserError.prototype.name = UserError.name

module.exports = UserError
