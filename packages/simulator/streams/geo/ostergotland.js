const { stops } = require('../transport/publicTransport')('otraf')
const { filter } = require('rxjs')
const Region = require('../../lib/class/geo/region')

const includedMunicipalities = [
  'Linköpings kommun',
  'Norrköpings kommun',
  'Motala kommun',
]

const skane = (municipalitiesStream) => {
  const municipalities = municipalitiesStream.pipe(
    filter((munipality) => includedMunicipalities.includes(munipality.name))
  )

  return new Region({
    id: 'otraf',
    name: 'Östergötland',
    kommuner: municipalities,
    stops,
  })
}

module.exports = skane
