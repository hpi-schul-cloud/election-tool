const util = require('../utils')
const UserError = require('../userError')
const wrap = require('./wrap')
const moment = require('moment')
const schedule = require('node-schedule')

module.exports = (app, db) => {
  const { Election, Student } = db

  /**
   * route to add a new election to the database
   * @name addElection
   * @param {object} req.body must contain an object describing an entire election except for id, candidates and votes
   * @returns {string} json string encoded object containing whether the creation was successful and the created id
   */
  app.post('/addElection', wrap(async (req) => {
    const election = req.body

    election.id = 'el' + util.generateID()
    election.voteId = 'vt' + util.generateID()

    await util.createVoteTable(election.voteId)

    const dbelection = new Election(election)
    await dbelection.save()

    if (!election.options.startPhasesManually) {
      election.currentPhase = 0

      const applicationStart = moment(election.options.applicationStartDate, 'DD.MM.YYYY HH:mm')
      const electionStart = moment(election.options.electionStartDate, 'DD.MM.YYYY HH:mm')
      const electionEnd = moment(election.options.electionEndDate, 'DD.MM.YYYY HH:mm')

      const electionId = election.id
      const schedulePhase = (time, currentPhase) => {
        if (time.isValid()) {
          if (time.isAfter(moment())) {
            schedule.scheduleJob(time.toDate(), async () => {
              try {
                await Election.findOneAndUpdate(
                  { _id: electionId },
                  { $set: { currentPhase } }
                )
                io.emit('routeUpdated', electionId)
              } catch (err) {
                console.error(err)
              }
            })
          } else {
            election.currentPhase = currentPhase
          }
        }
      }

      schedulePhase(applicationStart, 1)
      schedulePhase(electionStart, 2)
      schedulePhase(electionEnd, 3)

      await election.save()
    }

    return {
      message: 'Du hast erfolgreich eine neue Wahl angelegt! :)',
      electionId: election.id
    }
  }))

  /**
   * route to fetch the options for a specific election id
   * @name getElectionConfiguration
   * @param {object} req.body must contain an object containing the electionId
   * @returns {string} json string encoded object containing the election options
   */
  app.post('/getElectionConfiguration', wrap(async (req) => {
    const { options } = await util.openElection(req)

    return {
      votesPerUser: options.votesPerUser,
      useGender: options.useGender,
      showLivePreview: options.useLivePreview,
      startPhasesManually: options.startPhasesManually
    }
  }))

  /**
   * route to fetch the name connected to a specific election id
   * @name getElectionName
   * @param {object} req.body must contain an object containing the currently active route and electionId
   * @returns {string} either empty string if no election is found or election name as displayed in the header
   */
  app.post('/getElectionName', wrap(async (req) => {
    if (!req.body.electionId) {
      switch (req.body.route) {
        case '/':
        case '/electionCreation':
        case '/electionSelection':
          return ''
        default:
          throw new UserError('Diese Seite kann nicht ohne Wahl ID aufgerufen werden')
      }
    }

    const election = await util.openElection(req)

    return ' - ' + election.name
  }))

  /**
   * route to get all elections where a given student is eligible to vote
   * @name getStudentsElections
   * @param {object} req.body must contain an object containing the studentId
   * @returns {string} json string encoded object containing all elections grouped by open, closed and created
   */
  app.post('/getStudentsElections', wrap(async (req) => {
    const { studentId } = req.body
    const results = await Election.find()

    if (results.length === 0) {
      throw new UserError('There are no elections created yet!')
    }

    const elections = {
      openElections: [],
      closedElections: [],
      createdElections: []
    }

    for (const election of results) {
      const data = {
        id: election._id,
        name: election.name,
        description: election.description
      }
      if (election.eligibleVoters.includes(studentId)) {
        if (election.currentPhase !== 3) {
          elections.openElections.push(data)
        } else {
          elections.closedElections.push(data)
        }
      }
      if (election.electionOfficer === studentId) {
        elections.createdElections.push(data)
      }
    }

    return elections
  }))

  /**
   * route to get votes and election options for a given election
   * @name statistics
   * @param {object} req.body must contain an object containing the electionId
   * @returns {string} json string encoded object containing all elections options and the vote statistics
   */
  app.post('/statistics', wrap(async (req) => {
    const election = await util.openElection(req)
    const vote = await util.openVote(election)

    const electionOfficer = await Student.findById(election.electionOfficer)
    const abstentions = vote.votes.get('abstentions')

    return {
      schoolname: election.schoolname,
      electionOffice: election.office,
      electionCommittee: election.committee,
      electionOfficer: electionOfficer.name,
      electionStart: election.options.electionStartDate || '',
      electionEnd: election.options.electionEndDate || '',
      validVotes: vote.voter.length - 1 - abstentions,
      invalidVotes: election.eligibleVoters.length - vote.voter.length + 1,
      abstentions: abstentions
    }
  }))
}
