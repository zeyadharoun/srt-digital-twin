const { generateCars } = require('../../simulator/cars')
const { take, toArray } = require('rxjs/operators')

describe("cars", () => {
  const arjeplog = [{ lon: 17.886855, lat: 66.041054 }]
  const fleets = [{name: 'Postnord', market: 1}]

  it('should randomize at least 15 cars with initial positions', function (done) {
    generateCars(fleets, arjeplog, 15, Infinity).pipe(toArray()).subscribe(initialCars => {
      try {
        expect(initialCars).toHaveLength(15)
        expect(initialCars[0]).toHaveProperty('position')
        expect(initialCars[0].position).toHaveProperty('lat')
        expect(initialCars[0].position.lat).toBeGreaterThan(58)
        expect(initialCars[0].position.lat).toBeLessThan(67)
        expect(initialCars[0].position.lon).toBeGreaterThan(17)
        expect(initialCars[0].position.lon).toBeLessThan(19)
        done()
      } catch (err) { done(err) }
    })
  })
})
