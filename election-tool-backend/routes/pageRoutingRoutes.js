const util = require('../utils')
const wrap = require('./wrap')

module.exports = function (app) {
  /**
   * route to get the phase as route name that the given election is currently in
   * @name getRoute
   * @param {object} req.body must contain electionId: string
   * @returns {string} json string encoded object containing the route name as useful to the frontend
   */
  app.post('/getRoute', wrap(async (req) => {
    const active = []

    const election = await util.openElection(req)
    for (let i = 1; i <= election.currentPhase; i++) {
      active.push(util.getPageName(i))
    }

    return {
      routeName: util.getPageName(election.currentPhase),
      activePhases: active
    }
  }))

  /**
   * route to set the phase for the given election to the next one
   * @name nextPhase
   * @param {object} req.body must contain electionId: string
   * @returns {string} json string encoded object containing the new phase as route name useful to the frontend
   */
  app.post('/nextPhase', wrap(async (req) => {
    const election = await util.openElection(req)

    election.currentPhase = Math.min(election.currentPhase + 1, 3)
    await election.save()

    return { newPhase: util.getPageName(election.currentPhase) }
  }))

  /**
   * route to set the phase for the given election to the previous one, should only be used for debug purposes
   * @name prevPhase
   * @param {object} req.body must contain electionId: string
   * @returns {string} json string encoded object containing the new phase as route name useful to the frontend
   */
  app.post('/prevPhase', wrap(async (req) => {
    const election = await util.openElection(req)

    election.currentPhase = Math.max(election.currentPhase - 1, 0)
    await election.save()

    return { newPhase: util.getPageName(election.currentPhase) }
  }))
}
