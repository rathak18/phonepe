// models/eventQueue.js
class EventQueue {
    constructor() {
      this.queue = [];
    }
  
    enqueue(event) {
      this.queue.push(event);
    }
  
    dequeue() {
      return this.queue.shift();
    }
  }
  
  module.exports = EventQueue;
  