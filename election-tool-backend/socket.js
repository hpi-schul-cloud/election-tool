/******************************************************
 ************* defines all socketIO routes ************
 ******************************************************/

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('routeUpdateTrigger', (electionId) => {
      io.emit('routeUpdated', electionId)
    })

    socket.on('dataChangeTrigger', (electionId) => {
      io.emit('dataChanged', electionId)
    })

    socket.on('studentLoadedTrigger', (username) => {
      io.emit('studentLoaded', username)
    })

    socket.on('routeChosenTrigger', () => {
      io.emit('routeChosen')
    })
  })
}
