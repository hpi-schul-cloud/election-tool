const UserError = require('../userError')

module.exports = fn => async (req, res) => {
  let response
  try {
    const data = await fn(req, res)
    response = {
      success: true,
      error: '',
      data: data
    }
  } catch (err) {
    let msg = 'Es ist ein unerwarteter Fehler aufgetreten. Kontaktiere deinen Lehrer oder Admin wenn das öfter passiert.'
    if (err instanceof UserError) {
      msg = err.message
    } else {
      console.error(err)
    }
    response = {
      success: false,
      error: msg,
      data: { }
    }
  }
  res.send(JSON.stringify(response, null, 4) + '\n')
}
