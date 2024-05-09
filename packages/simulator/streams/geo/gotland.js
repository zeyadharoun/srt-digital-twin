const { stops } = require('../transport/publicTransport')('gotland')
const { filter } = require('rxjs')
const Region = require('../../lib/class/geo/region')

const includedMunicipalities = [
  'Gotlands Region',
]

const gotland = (municipalitiesStream) => {
  const municipalities = municipalitiesStream.pipe(
    filter((munipality) => includedMunicipalities.includes(munipality.name))
  )

  return new Region({
    id: 'gotland',
    name: 'Gotland',
    kommuner: municipalities,

    // Bus things.
    stops,
  })
}

module.exports = gotland
