// views/app.js
const AggregationService = require('./services/aggregationService.js');
const EventGenerator = require('./models/eventGenerator');
const EventQueue = require('./models/eventQueue.js');
const EventAggregator = require('./models/eventAggregator');
const EventConsumer = require('./models/eventConsumer');

const eventGenerator = new EventGenerator();
const eventQueue = new EventQueue();
const eventConsumer = new EventConsumer(eventQueue);
const eventAggregator = new EventAggregator();
const aggregationService = new AggregationService(eventAggregator);

eventGenerator.on('event', (event) => eventQueue.enqueue(event));

// Example: Generate 10 events with 3 types
eventGenerator.generateEvents(10, 3);

// Example: Create aggregation meta
const aggregationMeta = {
  aggregationName: 'installCountUser',
  eventType: 'EVENT_TYPE_1',
  aggregationType: 'count',
  aggregationField: 'eventData.key1', // Adjusted to match the structure
  filterRules: [{ field: 'eventData.key1', op: 'gt', value: 'value1_5' }],
};

// Example: Create aggregation using meta
eventAggregator.createMeta(aggregationMeta);

// Example: Get aggregation result
const result = aggregationService.getAggregation('installCountUser', 'EVENT_TYPE_1');
console.log(result);

