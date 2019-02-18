const util = require('../utils')
const UserError = require('../userError')
const wrap = require('./wrap')

module.exports = function (app, db) {
  /**
   * route to get the candidate to votes map for a given election
   * @name votes
   * @param {object} req.body must contain electionId: string
   * @returns {string} json string encoded object containing a map with the votes each candidate has
   */
  app.post('/votes', wrap(async (req) => {
    const election = await util.openElection(req)
    const vote = await util.openVote(election)
    return vote
  }))

  /**
   * route to check whether a student has already voted for a given election
   * @name hasVoted
   * @param {object} req.body must contain electionId: string and userID: string
   * @returns {string} json string encoded object where success is true if the user has already voted
   */
  app.post('/hasVoted', wrap(async (req) => {
    const { userID } = req.body.data

    const election = await util.openElection(req)
    const vote = await util.openVote(election)

    if (!vote.voter.includes(userID)) {
      throw new UserError('Du hast deine Stimme bereits vergeben')
    }

    return {}
  }))

  /**
   * route to add votes for a given election (this can be one or more, as determined for the election)
   * @name addVote
   * @param {object} req.body must contain electionId: string, userID: string and candidateIDs: Array
   * @returns {string} json string encoded object containing whether adding the vote(s) was successful
   */
  app.post('/addVote', wrap(async (req) => {
    const { userID, candidateIDs } = req.body.data

    const election = await util.openElection(req)
    const vote = await util.openVote(election)

    const isAbstention = candidateIDs.length === 0
    const type = isAbstention ? 'Enthaltung' : 'Wahl'

    if (election.currentPhase !== 2) {
      throw new UserError(`Leider ist die Wahlphase schon vorbei und wir können deine ${type} nicht mehr akzeptieren.`)
    }

    if (vote.voter.includes(userID)) {
      throw new UserError('Du hast bereits abgestimmt.')
    }

    if (isAbstention) {
      candidateIDs.push('abstentions')
    } else if (candidateIDs.length > election.options.votesPerUser) {
      candidateIDs.length = election.options.votesPerUser
    }

    for (const candidateID of candidateIDs) {
      vote.votes.set(candidateID, vote.votes.get(candidateID) + 1)
    }

    vote.voter.push(userID)
    vote.voter.sort()

    await vote.save()

    return { message: `Deine ${type} wurde erfolgreich aufgenommen!` }
  }))
}
