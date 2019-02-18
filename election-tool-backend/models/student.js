const mongoose = require('mongoose')

const StudentSchema = mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true }
  },
  {
    versionKey: false
  }
)

StudentSchema.virtual('id')
  .get(function () {
    return this._id
  })
  .set(function (val) {
    this._id = val
  })

module.exports = mongoose.model('Student', StudentSchema)
