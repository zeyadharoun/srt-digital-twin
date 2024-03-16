const { stops } = require('../transport/publicTransport')('skane')
const { filter } = require('rxjs')
const Region = require('../../lib/class/geo/region')

const includedMunicipalities = [
  'Helsingborgs stad',
  'Malmö stad',
  'Lunds kommun',
]

const skane = (municipalitiesStream) => {
  const municipalities = municipalitiesStream.pipe(
    filter((munipality) => includedMunicipalities.includes(munipality.name))
  )

  return new Region({
    id: 'skane',
    name: 'Skåne',
    kommuner: municipalities,
    stops,
  })
}

module.exports = skane
