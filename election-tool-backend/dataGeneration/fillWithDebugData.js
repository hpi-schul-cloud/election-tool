// only to be used for debugging in an environment completely separated from Schul-Cloud
const mongoose = require('mongoose')
const dataFunctions = require('./dataCreationFunctions')

const { dbPath } = require('../config')

mongoose.connect(dbPath)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

let Student = require('../models/student')

let students = [ ]

db.once('open', async function (err) {
  if (err) console.error(err)

  await dataFunctions.createStudents()

  await Student.find({ }, setFoundStudents)

  if (!students.length) {
    return console.error('Students didn\'t load correctly, please retry running this script')
  }

  await dataFunctions.createElections(students)

  await dataFunctions.createCandidates(students)

  await dataFunctions.createVotes()

  db.close()
})

async function setFoundStudents (err, result) {
  if (err) return console.error(err)

  students = result
}
