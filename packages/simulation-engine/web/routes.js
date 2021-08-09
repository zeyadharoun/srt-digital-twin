const engine = require('../index')
// const postombud = require("../streams/postombud");
const { fromEvent, interval, of, from, merge, combineLatest } = require('rxjs')
const {
  window,
  map,
  toArray,
  mergeMap,
  tap,
  bufferTime,
  scan,
  reduce,
  concatMap,
  throttleTime
} = require('rxjs/operators')

function register(io) {
  io.on('connection', function (socket) {
    engine.cars
      .pipe(
        concatMap((car) => fromEvent(car, 'moved').pipe(map(() => car))),
        map(({ position: { lon, lat }, id, heading, speed, bearing }) => ({
          id,
          // heading, // contains route to plot or interpolate on client side.
          speed,
          bearing,
          position: [lon, lat],
        })),
        bufferTime(200)
      )
      .subscribe((cars) => {
        socket.volatile.emit('cars', cars)
      })

    engine.postombud.pipe(toArray()).subscribe((postombud) => {
      socket.emit('postombud', postombud)
    })

    engine.bookings
      .pipe(
        mergeMap(booking => merge(of(booking), fromEvent(booking, 'moved'), fromEvent(booking, 'pickedup'), fromEvent(booking, 'assigned'), fromEvent(booking, 'delivered'), )),
        map(({ destination: { name, position }, id, status }) => ({ id, name, position, status })),
        bufferTime(500)
      )
      .subscribe((bookings) => {
        if (bookings.length) socket.emit('bookings', bookings)
      })


    engine.kommuner
      .pipe(
        mergeMap(
          ({bookings, name, geometry, cars}) =>  {
            const totalBookings = bookings.pipe(
              scan((a) => a + 1, 0), 
            )

            // TODO: This is counting inactive cars
            const totalCars = cars.pipe(
              scan((a) => a + 1, 0),
            )

            const totalCapacity = cars.pipe(
              scan((acc, car) => acc + car.capacity, 0)
            )

            // TODO: Broken. Should car.cargo (or car.statistics) be a stream?
            const totalCargo = cars.pipe(
              scan((acc, car) => acc + car.cargo.length, 0) 
            )

            return combineLatest([totalBookings, totalCars, totalCapacity, totalCargo]).pipe(
              map(([totalBookings, totalCars, totalCapacity, totalCargo]) => ({
                name, geometry, totalBookings, totalCars, totalCapacity, totalCargo
              })),
              // Do not emit more than 1 event per kommun per second
              throttleTime(1000)
            )
          }),
      )
      .subscribe(data => {
        socket.emit('kommun', [data])
      })
  })
}

module.exports = {
  register,
}
