const util = require('../utils')
const UserError = require('../userError')
const wrap = require('./wrap')

module.exports = function (app, db) {
  const { Candidate } = db

  /**
   * route to get all candidates for a given election
   * @name candidates
   * @param {object} req.body must contain electionId: string
   * @returns {string} json string encoded object containing the candidates and how many votes are allowed per person
   */
  app.post('/candidates', wrap(async (req) => {
    const election = await util.openElection(req)
    const vote = await util.openVote(election)

    const candidateIds = election.candidates

    const candidates = await Candidate.find({
      _id: { $in: candidateIds.map(e => e.candidateId) }
    })

    if (election.currentPhase !== 3) {
      candidates.sort((candidate1, candidate2) => {
        const name1 = candidate1.name.toLowerCase()
        const name2 = candidate2.name.toLowerCase()
        return name1.localeCompare(name2)
      })
    } else {
      candidates.sort((candidate1, candidate2) => {
        const votes1 = vote.votes.get(candidate1.id)
        const votes2 = vote.votes.get(candidate2.id)
        return votes2 - votes1
      })
    }

    const { votesPerUser } = election.options

    return { candidates, votesPerUser }
  }))

  /**
   * route to apply as a candidate to the election
   * @name addCandidate
   * @param {object} req.body must contain electionId: string and data: object with the data describing a candidate
   * @returns {string} json string encoded object showing whether the candidate was successfully created
   */
  app.post('/addCandidate', wrap(async (req) => {
    const candidate = req.body.data

    const election = await util.openElection(req)

    if (election.currentPhase !== 1) {
      throw new UserError(
        'Leider ist die Bewerbungsphase schon vorbei. ' +
        'Sprich mit deinem Lehrer wenn du noch eine Bewerbung einreichen willst.'
      )
    }

    candidate.id = election.id + '_' + candidate.id
    if (election.candidates.findIndex((e) => e.candidateId === candidate.id) !== -1) {
      throw new UserError('Du hast dich bereits beworben. Wenn du die Bewerbung ansehen möchtest klicke auf Bewerbung bearbeiten!')
    }

    const vote = await util.openVote(election)

    vote.votes.set(candidate.id, 0)
    await vote.save()

    election.candidates.push({ candidateId: candidate.id })
    await election.save()

    const dbcandidate = new Candidate(candidate)
    await dbcandidate.save()

    return { message: 'Du hast deine Kandidatur erfolgreich eingereicht! :)' }
  }))

  /**
   * route to edit a candidates application for the election
   * @name editCandidate
   * @param {object} req.body must contain electionId: string and data: object with the data describing a candidate
   * @returns {string} json string encoded object showing whether the candidate was successfully updated
   */
  app.post('/editCandidate', wrap(async (req) => {
    const candidate = req.body.data

    const election = await util.openElection(req)

    if (election.currentPhase !== 1) {
      throw new UserError(
        'Leider ist die Bewerbungsphase schon vorbei ' +
        'und du kannst deine Bewerbung nicht mehr ändern.'
      )
    }

    candidate.id = election.id + '_' + candidate.id
    await Candidate.findOneAndUpdate({ _id: candidate.id }, candidate)

    return { message: 'Du hast deine Bewerbung erfolgreich geändert!' }
  }))

  /**
   * route to remove candidate from election
   * @name deleteCandidate
   * @param {object} req.body must contain electionId: string and data: object with the data being a student name and id
   * @returns {string} json string encoded object showing whether the candidate was successfully removed
   */
  app.post('/deleteCandidate', wrap(async (req) => {
    const candidate = req.body.data

    const election = await util.openElection(req)

    if (election.currentPhase !== 1) {
      throw new UserError(
        'Leider ist die Bewerbungsphase schon vorbei ' +
        'und du kannst deine Bewerbung nicht mehr löschen.'
      )
    }

    candidate.id = election.id + '_' + candidate.id
    await Candidate.findOneAndDelete({ _id: candidate.id, name: candidate.name })

    const vote = await util.openVote(election)

    vote.votes.delete(candidate.id)
    await vote.save()

    election.candidates.remove({ candidateId: candidate.id })
    await election.save()

    return { message: 'Deine Bewerbung wurde erfolgreich gelöscht!' }
  }))

  /**
   * route to get a candidate's data
   * @name loadApplication
   * @param {object} req.body must contain electionId: string and data: object with the data being a student name and id
   * @returns {string} json string encoded object containing the candidate's data (gender, info etc.)
   */
  app.post('/loadApplication', wrap(async (req) => {
    const candidate = req.body.data

    const election = await util.openElection(req)

    if (election.currentPhase !== 1) {
      throw new UserError(
        'Leider ist die Bewerbungsphase schon vorbei ' +
        'und du kannst deine Bewerbung nicht mehr abrufen.'
      )
    }

    candidate.id = election.id + '_' + candidate.id
    const result = await Candidate.findOne({ _id: candidate.id, name: candidate.name })
    if (!result) {
      throw new UserError('Du hast noch keine Bewerbung abgegeben, mach das doch jetzt direkt auf dieser Seite!')
    }
    return result
  }))
}
