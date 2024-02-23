const EventEmitter = require('events');

class EventConsumer extends EventEmitter {
    constructor(eventQueue) {
        super();
        this.eventQueue = eventQueue;
    }

    startConsuming() {
        // Assuming dequeue is asynchronous, otherwise, this is not necessary
        this.processNextEvent();
    }

    processNextEvent() {
        if (this.eventQueue.length > 0) {
            const event = this.eventQueue.dequeue();
            this.emit('event', event); // Emit the event
            this.processNextEvent(); // Process the next event
        } else {
            // Queue is empty, you may want to wait or perform other actions
            // For example, wait for a certain period and then check again
            setTimeout(() => {
                this.processNextEvent();
            }, 1000); // Wait for 1 second (adjust as needed)
        }
    }
}

module.exports = EventConsumer;
