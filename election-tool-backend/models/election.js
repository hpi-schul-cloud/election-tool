const mongoose = require('mongoose')

const CandidateIDSchema = mongoose.Schema(
  { candidateId: { type: String, required: true } },
  { _id: false }
)

const ElectionOptionsSchema = mongoose.Schema(
  {
    votesPerUser: { type: Number, required: true },
    useGender: { type: Boolean, required: true },
    useLivePreview: { type: Boolean, required: true },
    startPhasesManually: { type: Boolean, required: true },
    applicationStartDate: { type: String, required: false },
    electionStartDate: { type: String, required: false },
    electionEndDate: { type: String, required: false }
  }
)

const ElectionSchema = mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    schoolname: { type: String, required: false },
    electionOfficer: { type: String, required: true },
    office: { type: String, required: true },
    committee: { type: String, required: true },
    description: { type: String, required: true },
    currentPhase: { type: Number, required: true },
    eligibleVoters: [ { type: String } ],
    options: { type: ElectionOptionsSchema, required: true },
    candidates: [ CandidateIDSchema ],
    voteId: { type: String, required: true }
  },
  {
    versionKey: false
  }
)
ElectionSchema.virtual('id')
  .get(function () {
    return this._id
  })
  .set(function (val) {
    this._id = val
  })

module.exports = mongoose.model('Election', ElectionSchema)
