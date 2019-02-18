/******************************************************
 **** opens database and exports all needed models ****
 ******************************************************/

const mongoose = require('mongoose')
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)

module.exports = {
  connection: mongoose.connection,
  mongoose,
  Candidate: require('./models/candidate'),
  Election: require('./models/election'),
  Vote: require('./models/vote'),
  Student: require('./models/student')
}
