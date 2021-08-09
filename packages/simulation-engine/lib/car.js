const osrm = require('../lib/osrm')
const distance = require('./distance')
const interpolate = require('./interpolate')
const EventEmitter = require('events')
const Booking = require('./booking')
const { safeId } = require('./id')
const { assert } = require('console')

class Car extends EventEmitter {
  constructor({id = safeId(), position, status = 'Ready', timeMultiplier = 60} = {}) {
    super()
    this.id = id
    this.position = position
    this.history = []
    this.queue = []
    this.cargo = []
    this.capacity = 50 // bookings
    this.status = status
    this.lastPositions = []
    this.timeMultiplier = timeMultiplier
    this.on('error', (err) => console.error('car error', err))
    this.emit('moved', this)
  }

  simulate(heading) {
    clearInterval(this._interval)
    this._timeStart = Date.now()
    if (!heading) return
    if (this.timeMultiplier === Infinity) return this.updatePosition(heading) // teleport mode
    this._interval = setInterval(() => {
      const diff = Date.now() - this._timeStart
      const newPosition = interpolate.route(heading.route, Date.now() + diff * this.timeMultiplier) ?? heading
      this.updatePosition(newPosition)
      // console.log('interval', this.ema, this.speed, this.id)
    }, Math.random() * 300)
  }

  navigateTo(position) {
    this.heading = position
    return osrm
      .route(this.position, this.heading)
      .then((route) => {
        route.started = new Date()
        this.heading.route = route
        if(!route.legs) throw new Error(`Route not found from: ${JSON.stringify(this.position)} to: ${JSON.stringify(this.heading)}`)
        this.simulate(this.heading)
        return this.heading
      })
      .catch(console.error)
  }

  handleBooking(booking) {
    assert(booking instanceof Booking, 'Booking needs to be of type Booking')
    this.history.push({ status: 'received_booking', date: new Date(), booking })
    if (!this.busy) {
      this.busy = true
      // this.booking = booking
      this.cargo.push(booking)
      booking.assigned(this)
      this.status = 'Pickup'
      this.navigateTo(booking.pickup.position)
    } else {
      this.queue.push(booking)
      booking.queued(this)
      //console.log(`*** Car#${this.id}: queued ${this.queue.length} bookings`)
    }
    return booking
  }

  pickup() {
    this.emit('pickup', this)
    this.queue.sort((a, b) => haversine(this.position, a.pickup.position) - haversine(this.position, b.pickup.position))

    // wait one tick so the pickup event can be parsed before changing status
    setImmediate(() => {
      this.queue
        // see if we have more packages to deliver from this position
        .filter(booking => haversine(this.position, booking.pickup.position) < 50)
        .map(booking => {
          booking.pickedUp(this.position)
          this.cargo.push(booking)
        })
      this.booking = this.cargo.shift() // pick the first package and go there
      if (this.booking && this.booking.destination) {
        this.booking.pickedUp(this.position)
        this.status = 'Delivery'
        this.navigateTo(this.booking.destination.position)
      }
    })
  }

  dropOff() {
    if (this.booking) {
      this.busy = false
      this.booking.droppedOff(this.position)
      this.emit('dropoff', this)
      this.cargo.sort((a, b) => haversine(this.position, a.destination.position) - haversine(this.position, b.destination.position))

      this.booking = this.cargo.shift()
      this.navigateTo(this.booking.destination.position)
      return
    }

    const nextBooking = this.queue.shift(this.queue)
    if (nextBooking) {
      this.handleBooking(nextBooking)
    } else {
      this.status = 'Ready'
      this.simulate(false) // chilla
    }
  }

  
  async updatePosition(position, date = Date.now()) {
    const lastPosition = this.lastPositions[this.lastPositions.length-1] || position
    const metersMoved = distance.haversine(lastPosition, position)
    const bearing = distance.bearing(lastPosition, position) || 0
    const [km, h] = [(metersMoved / 1000), (date - lastPosition.date) / 1000 / 60 / 60]
    this.speed = Math.round((km / h / (this._timeMultiplier || 1)) || 0)
    this.position = position
    this.bearing = bearing
    this.lastPositions.push({ ...position, date })
    this.ema = distance.haversine(this.heading, this.position)
    this.emit('moved', this)
    if (this.ema < 50) {
    this.emit('stopped', this)
      this.simulate(false)
      if (this.booking) {
        if (this.status === 'Pickup') this.pickup()
        if (this.status === 'Delivery') this.dropOff()
      }
    }
  }
}
 
module.exports = Car
