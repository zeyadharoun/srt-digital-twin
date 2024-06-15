const Vehicle = require('./vehicle')

const { error, info } = require('../../log')
const { range, share, from } = require('rxjs')

// TODO: create this somewhere else as real fleet
const lanstrafiken = {
  name: 'Länstrafiken i Norrbotten',
}

class Bus extends Vehicle {
  constructor({
    startPosition,
    position,
    heading,
    lineNumber,
    id,
    stops,
    finalStop,
    parcelCapacity,
    passengerCapacity,
    kommun,
    ...vehicle
  }) {
    super({
      position,
      id,
      stops,
      fleet: lanstrafiken,
      ...vehicle,
    })
    this.lineNumber = lineNumber
    this.finalStop = finalStop
    this.vehicleType = 'bus'
    this.heading = heading
    this.kommun = kommun
    this.passengers = []
    this.passengersLength = 0
    this.startPosition = startPosition
    this.passengerCapacity = passengerCapacity // TODO: fill this from the workshop poll
    this.parcelCapacity = parcelCapacity // TODO: fill this from the workshop poll
    this.co2PerKmKg = 1.3 // NOTE: From a quick google. Needs to be verified.
  }

  canHandleBooking(booking) {
    return booking.type === 'busstop' || booking.type === 'parcel'
  }

  async handleBooking(booking) {
    this.queue.push(booking)
    booking.queued(this)
    if (!this.booking) {
      this.pickNextFromQueue()
    }
    return booking
  }

  reset() {
    this.queue = []
    this.position = this.startPosition
  }

  // This is called when the bus arrives at each stop. Let's check if the departure time
  // is in the future. If it is, we wait until the departure time.
  async pickup() {
    this.booking = this.queue.shift()
    if (!this.booking) {
      this.simulate(false)
      return
    }

    await this.waitAtPickup()

    // NOTE: 5. Fetch citizens from bus stops and update passenger capacity

    // If there is capacity for all waiting passengers
    if (this.passengerCapacity - (this.passengersLength + this.booking.pickup.passagerare) > 0){
      this.passengersLength += this.booking.pickup.passagerare
      this.booking.pickup.passagerare = 0
    }
    // If there is capacity for some waiting passengers
    else if (this.passengerCapacity - this.passengersLength < this.booking.pickup.passagerare){
      somePassengers = this.passengerCapacity - this.passengersLength
      this.booking.pickup.passagerare -= somePassengers
      this.passengersLength += somePassengers
    }

    this.lineNumber = this.booking.lineNumber
      ? this.booking.lineNumber
      : this.lineNumber

    this.booking.pickedUp(this.position)
    if (this.booking.type !== 'busstop') {
      this.cargo.push(this.booking)
    }

    if (!this.booking) {
      this.simulate(false)
      return
    }
    this.status = 'toDelivery'
    return this.navigateTo(this.booking.destination.position) // resume simulation
  }

  dropOff() {
    if (this.booking) {
      // NOTE: 6. Leave citizens at bus stops and update passenger capacity
      this.passengerLength = Math.max(0, this.passengerLength - 5)

      this.booking.delivered(this.position)
      this.delivered.push(this.booking)
      this.booking = null
    }
    this.statusEvents.next(this)

    this.pickNextFromQueue()
  }

  async pickNextFromQueue() {
    const booking = this.queue.shift()
    if (!booking) return

    this.booking = booking
    booking.assign(this)
    this.status = 'toPickup'
    await this.navigateTo(booking.destination.position)
    this.movedEvents.next(this)
  }
}

module.exports = Bus
