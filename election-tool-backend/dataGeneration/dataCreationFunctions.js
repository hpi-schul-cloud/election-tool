let Election = require('../models/election')
let Candidate = require('../models/candidate')
let Vote = require('../models/vote')
let Student = require('../models/student')

const util = require('../utils')

const names = [
  'Missy Aldred',
  'Rowena Irwin',
  'Alysia Povey',
  'Eva Cross',
  'Zahrah Vasquez',
  'Emerson Mason',
  'Kiara Cantrell',
  'Melina Dickson',
  'Ellie-May Dowling',
  'Ashwin Kirkpatrick',
  'Ocean Schneider',
  'Mohammed Sanderson',
  'Grover Markham',
  'Ned Butler',
  'Saarah Nelson',
  'Clark Burch',
  'Jim Morrow',
  'Ayse Bernard',
  'Leonard Long',
  'Dorothy Gamble',
  'Lacey-May Ibarra',
  'Harpreet Villalobos',
  'Aubree Arellano',
  'Dwayne Garner',
  'Cleveland Ahmed',
  'Ayomide Redfern',
  'Jamel Summers',
  'Ayana Boyd',
  'Celine Collier',
  'Frederick Neville',
  'Nazim Nash',
  'Susie Chaney',
  'Kade Mcclure',
  'Roseanna Carson',
  'Maksymilian Forster'
]

let elections = [
  {
    name: 'Schülersprecherwahl 2018',
    id: 'el000000000001',
    schoolname: 'Albert-Schweitzer-Gymnasium Erfurt',
    electionOfficer: '',
    scrutineer1: '',
    scrutineer2: '',
    office: 'Schülersprecher',
    committee: 'Versammlung der Klassensprecher',
    description: 'Unsere erste Wahl!',
    options: {
      votesPerUser: 1,
      useGender: true,
      useLivePreview: true,
      startPhasesManually: true
    },
    currentPhase: 0,
    eligibleVoters: [ ],
    candidates: [ ],
    voteId: 0
  },
  {
    name: 'Klassensprecherwahl Klasse 7a',
    id: 'el000000000002',
    schoolname: 'Albert-Schweitzer-Gymnasium Erfurt',
    electionOfficer: '',
    scrutineer1: '',
    scrutineer2: '',
    office: 'Klassensprecher',
    committee: 'Klasse 7a',
    description: 'Wir brauchen einen Klassensprecher!',
    options: {
      votesPerUser: 1,
      useGender: true,
      useLivePreview: true,
      startPhasesManually: false,
      applicationStartDate: 'applicationStartDate',
      electionStartDate: '20.01.2019 12:00',
      electionEndDate: '21.01.2019 12:00'
    },
    currentPhase: 0,
    eligibleVoters: [ ],
    candidates: [ ],
    voteId: 1
  }
]

let candidates = [
  {
    name: '',
    gender: '',
    id: '',
    info: 'Ich bin Schülerin der 9. Klasse. Meine Hobbies sind Reiten, Schwimmen, Klettern, Ballet, Shoppen gehen und Klavier spielen.',
    motivation: 'Ich bin zuverlässig, ambitioniert. Ich werde unsere Schule gut vertreten. Außerdem werde ich mich dafür einsetzen, dass es überall im Schulgebäude kostenlose Wasserspender gibt.'
  },
  {
    name: '',
    gender: '',
    id: '',
    info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ipsum dolor sit amet consectetur adipiscing. Tellus cras adipiscing enim eu turpis egestas pretium aenean. Orci ac auctor augue mauris augue neque gravida in fermentum. Sed libero enim sed faucibus turpis in eu mi bibendum. Eu consequat ac felis donec. Nisl pretium fusce id velit ut tortor pretium. Faucibus turpis in eu mi bibendum neque. Pharetra vel turpis nunc eget lorem dolor sed. Etiam non quam lacus suspendisse faucibus interdum posuere lorem ipsum. Arcu vitae elementum curabitur vitae. Risus nullam eget felis eget nunc lobortis mattis aliquam. ',
    motivation: 'Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Amet consectetur adipiscing elit duis. Est lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque.'
  },
  {
    name: '',
    gender: '',
    id: '',
    info: 'Ich bin Schüler der 10. Klasse. Meine Hobbies sind Karate, Schwimmen, Volleyball, Ski fahren, Lego bauen und Gitarre spielen.',
    motivation: 'Ich bin zuverlässig, ambitioniert. Ich werde unsere Schule gut vertreten. Außerdem werde ich mich dafür einsetzen, dass es  im Schulgebäude Ruheräume gibt.'
  },
  {
    name: '',
    gender: '',
    id: '',
    info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ipsum dolor sit amet consectetur adipiscing. Tellus cras adipiscing enim eu turpis egestas pretium aenean. Orci ac auctor augue mauris augue neque gravida in fermentum. Sed libero enim sed faucibus turpis in eu mi bibendum. Eu consequat ac felis donec. Nisl pretium fusce id velit ut tortor pretium. Faucibus turpis in eu mi bibendum neque. Pharetra vel turpis nunc eget lorem dolor sed. Etiam non quam lacus suspendisse faucibus interdum posuere lorem ipsum. Arcu vitae elementum curabitur vitae. Risus nullam eget felis eget nunc lobortis mattis aliquam. ',
    motivation: 'Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Amet consectetur adipiscing elit duis. Est lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque.'
  }
]

/* ********************** UTILS ********************* */

function randomGender () {
  if (Math.random() < 0.5) {
    return 'Männlich'
  } else {
    return 'Weiblich'
  }
}

function voteRandomizer () {
  return Math.floor(Math.random() * 4 + 1)
}

/* ***************** STUDENT ADDING ***************** */

async function createStudents () {
  await Student.deleteMany({}, function (err) {
    if (err) return console.error(err)
  })

  await addStudents()
}

async function addStudents () {
  for (let i = 0; i < names.length; ++i) {
    let student = new Student({
      _id: util.generateID(),
      name: names[i]
    })
    await student.save()
  }
  // create 5 students with duplicate names to test the tools behavior
  for (let i = 0; i < 5; ++i) {
    let randomNum = Math.floor(Math.random() * 35)
    let student = new Student({
      _id: util.generateID(),
      name: names[randomNum]
    })
    await student.save()
  }
}

/* **************** ELECTION CREATION *************** */

async function createElections (students) {
  await Election.deleteMany({}, function (err) {
    if (err) return console.error(err)
  })

  await Vote.deleteMany({}, function (err) {
    if (err) return console.error(err)
  })

  await addElections(students)
}

async function addElections (students) {
  for (let i = 0; i < elections.length; ++i) {
    let election = new Election(elections[i])
    console.log(election)
    let voters = Math.floor(Math.random() * 20 + 20)
    let addedStudents = new Set()
    for (let j = 0; j < voters; ++j) {
      let studentId
      do {
        let studentPos = Math.floor(Math.random() * 40)
        studentId = students[studentPos]
      } while (addedStudents.has(studentId))
      if (j === voters - 1) {
        election.electionOfficer = studentId
      } else {
        addedStudents.add(studentId)
        election.eligibleVoters.push(studentId)
      }
    }
    election.voteId = 'vt' + util.generateID()
    await util.createVoteTable(election.voteId)
    await election.save()
  }
}

/* ***************** DATA ADDING ******************** */
async function createCandidates (students) {
  await Candidate.deleteMany({}, function (err) {
    if (err) return console.error(err)
  })

  let burntIds = [ ]

  for (let i = 0; i < candidates.length; ++i) {
    let randomStudent
    do {
      randomStudent = Math.floor(Math.random() * 40)
    } while (burntIds.find(function (el) { return (el === students[randomStudent].id) }))

    burntIds.push(students[randomStudent].id)

    candidates[i].name = students[randomStudent].name
    candidates[i].id = students[randomStudent].id
    candidates[i].gender = randomGender()
  }

  await addCandidates(elections[0].id)

  burntIds = [ ]

  for (let i = 0; i < candidates.length; ++i) {
    let randomStudent
    do {
      randomStudent = Math.floor(Math.random() * 40)
    } while (burntIds.find(function (el) { return (el === students[randomStudent].id) }))

    burntIds.push(students[randomStudent].id)

    candidates[i].name = students[randomStudent].name
    candidates[i].id = students[randomStudent].id
    candidates[i].gender = randomGender()
  }

  await addCandidates(elections[1].id)
}

async function addCandidates (electionId) {
  let election
  await Election.findById(electionId, function (err, result) {
    if (err) return console.error(err)
    election = result
  })

  let newCandidates = [ ]
  for (let i = 0; i < candidates.length; ++i) {
    let id = electionId + '_' + candidates[i].id
    newCandidates.push({ candidateId: id })

    let candidate = new Candidate(candidates[i])
    candidate.id = id
    await candidate.save()
  }

  election.candidates = newCandidates
  await Election.findOneAndUpdate({ _id: election.id }, election, function (err) {
    if (err) return console.error(err)
  })
}

async function createVotes () {
  await addVotes(elections[0].id)
  await addVotes(elections[1].id)
}

async function addVotes (electionId) {
  let election
  await Election.findById(electionId, function (err, result) {
    if (err) return console.error(err)

    election = result
  })

  let voteId = election.voteId
  let vote
  await Vote.findById(voteId, function (err, result) {
    if (err) return console.error(err)

    vote = result
  })

  await election.candidates.forEach(async function (val, idx, arr) {
    console.log(val.candidateId)
    vote.votes.set(val.candidateId, voteRandomizer())
  })

  await Vote.findOneAndUpdate({ _id: vote.id }, vote, function (err) {
    if (err) return console.error(err)
  })
}

module.exports = { createStudents, createElections, createCandidates, createVotes }
