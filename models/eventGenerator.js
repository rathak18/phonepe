const EventEmitter = require('events');

class EventGenerator extends EventEmitter {
  generateEvents(n, m) {
    return new Promise((resolve) => {
      for (let i = 0; i < n; i++) {
        const eventType = `EVENT_TYPE_${Math.floor(Math.random() * m) + 1}`;
        const timestamp = new Date();
        const eventData = { key1: `value1_${i}`, key2: `value2_${i}`, key3: `value3_${i}` };
        this.emit('event', { eventType, timestamp, eventData });

        if (i === n - 1) {
          resolve(); // Resolve the promise when all events are generated
        }
      }
    });
  }
}

module.exports = EventGenerator;
