const UserError = require('../userError')
const wrap = require('./wrap')
const studentRoutes = require('./studentRoutes')
const candidateRoutes = require('./candidateRoutes')
const electionRoutes = require('./electionRoutes')
const pageRouting = require('./pageRoutingRoutes')
const voteRoutes = require('./voteRoutes')

module.exports = (app, db) => {
  studentRoutes(app, db)
  candidateRoutes(app, db)
  electionRoutes(app, db)
  pageRouting(app, db)
  voteRoutes(app, db)

  // purely for debug purposes - returns a random student id when called
  // can be deleted when credentials are transmitted by Schul-Cloud
  const { Student } = db
  app.get('/randomId', wrap(async () => {
    const results = await Student.find({})

    if (results.length === 0) {
      throw new UserError('There are no students to get one from!')
    }

    return results[ Math.floor(Math.random() * results.length) ]
  }))
}
