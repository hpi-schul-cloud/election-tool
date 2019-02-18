/******************************************************
 * defines all commonly used functions for global use *
 ******************************************************/

let crypto = require('crypto')
const { Election, Vote } = require('./db')
const UserError = require('./userError')

const pageMap = new Map([[0, 'Info'], [1, 'Application'], [2, 'Vote'], [3, 'Results']])

const seenDeprecated = new Set()
const deprecated = (msg) => {
  if (!seenDeprecated.has(msg)) {
    seenDeprecated.add(msg)
    console.error('deprecated:', msg)
  }
}
class Utils {
  deprecated (msg) {
    deprecated(msg)
  }

  /**
   * Returns the frontend readable route name to a given route id
   * @param {int} pageId from 0 and 3
   * @returns {string} readable route name
   */
  getPageName (pageId) {
    return pageMap.get(pageId)
  }

  /**
   * deprecated, use getPageName(pageId) instead
   * @returns {Map<int, string>} map from page id to frontend readable route name
   */
  pageMap () {
    deprecated('pageMap, use getPageName instead')
    return pageMap
  }

  /**
   * searches for the election given by the requests body and returns it if found
   * @param req the request sent by the frontend to a backend route
   * @returns {Promise<void>} the election object found within a Promise
   */
  async openElection (req) {
    const { electionId } = req.body

    const result = await Election.findById(electionId)
    if (!result) {
      throw new UserError(
        'Leider konnten wir keine Wahl mit der übermittelten ID finden. ' +
        'Vergewissere dich, dass du dem richtigen Link gefolgt bist und ' +
        'wende dich bei weiteren Problemen an deinen Lehrer.'
      )
    }

    return result
  }

  /**
   * gets and returns the vote table associated with the given election
   * @param {Election} election object (as defined in models/election.js)
   * @returns {Promise<void>} the vote object found within a Promise
   */
  async openVote (election) {
    const result = await Vote.findById(election.voteId)
    if (!result) {
      throw new UserError(
        'Votes entry with ID ' + election.voteId + ' could not be found. ' +
          'Error originated from election with ID ' + election.id
      )
    }

    return result
  }

  /**
   * deprecated, function is not needed anymore
   * @param {Candidate} val
   * @returns {Candidate} simply passes val through
   */
  makePassableCandidate (val) {
    deprecated('makePassableCandidate, use nothing instead')
    return val
  }

  /**
   * generates a 9 Byte long random id string
   * @returns {string} random id
   */
  generateID () {
    return crypto.randomBytes(9).toString('base64')
  }

  /**
   * creates, initializes and saves a Vote table as defined in models/vote.js
   * @param {string} voteId to be used for the created table
   * @returns {Promise<void>} function completion can be waited for
   */
  async createVoteTable (voteId) {
    let vote = new Vote({
      _id: voteId,
      votes: { 'abstentions': 0 },
      voter: {}
    })
    await vote.save()
  }

  /**
   * creates, initializes and returns a prototype object used in returns to the frontend upon requests
   * @returns {object} contains the fields success (bool), error (string) and data (object)
   */
  successObject () {
    deprecated('successObject, use UserError instead')
    return {
      success: false,
      error: 'Es ist ein unerwarteter Fehler aufgetreten. Kontaktiere deinen Lehrer oder Admin wenn das öfter passiert.',
      data: { }
    }
  }
}

module.exports = new Utils()
