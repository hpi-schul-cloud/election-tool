const mongoose = require('mongoose')

const VoteSchema = mongoose.Schema(
  {
    _id: { type: String, required: true },
    votes: { type: Map, of: Number, required: true },
    voter: { type: Array, of: String, required: true }
  },
  {
    versionKey: false
  }
)

VoteSchema.virtual('id')
  .get(function () {
    return this._id
  })
  .set(function (val) {
    this._id = val
  })

module.exports = mongoose.model('Vote', VoteSchema)
