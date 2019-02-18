const util = require('../utils')
const wrap = require('./wrap')

module.exports = function (app, db) {
  const { Student } = db

  /**
   * route to get all students from the database
   * @name getStudents
   * @returns {string} json string encoded object containing all students in the database
   */
  app.get('/getStudents', wrap(() => Student.find()))

  /**
   * route to check whether a user is allowed to access a specific election
   * @name checkUser
   * @param {object} req.body must contain electionId: string and studentId: string
   * @returns {string} json string encoded object containing info if the student is valid for the election
   */
  app.post('/checkUser', wrap(async (req) => {
    const { studentId } = req.body

    const { eligibleVoters } = await util.openElection(req)

    return {
      isValid: eligibleVoters.includes(studentId)
    }
  }))

  /**
   * route to check whether a user is allowed to access a specific election's creator page
   * @name checkCreator
   * @param {object} req.body must contain electionId: string and studentId: string
   * @returns {string} json string encoded object containing info if the student is creator of the election
   */
  app.post('/checkCreator', wrap(async (req) => {
    const { studentId } = req.body

    const { electionOfficer } = await util.openElection(req)

    return {
      isValid: electionOfficer === studentId
    }
  }))
}
