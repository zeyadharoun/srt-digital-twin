const { save } = require('../deps/elastic')

const collectExperimentMetadata = (experiment) => {
  return save(experiment, 'experiments')
}

const collectBooking = (booking, experimentSettings) => {
  return save(
    {
      ...booking.toObject(),
      timestamp: new Date(),
      experimentSettings,
      passenger: booking.passenger?.toObject(),
    },
    'bookings'
  )
}

module.exports = {
  collectExperimentMetadata,
  collectBooking,
}
