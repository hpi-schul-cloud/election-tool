const mongoose = require('mongoose')

const CandidateSchema = mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    info: { type: String, required: true },
    motivation: { type: String, required: true }
  },
  {
    versionKey: false
  }
)

CandidateSchema.virtual('id')
  .get(function () {
    return this._id
  })
  .set(function (val) {
    this._id = val
  })

CandidateSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Candidate', CandidateSchema)
