// services/aggregationService.js
class AggregationService {
  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;
  }

  createMeta(aggregationMeta) {
    this.eventAggregator.createMeta(aggregationMeta);
  }

  getAggregation(aggregationName, eventType) {
    // Use the eventAggregator to access aggregationMeta and events
    const aggregationMeta = this.eventAggregator.aggregationMeta.find(
      (meta) => meta.aggregationName === aggregationName && meta.eventType === eventType
    );

    if (!aggregationMeta) {
      throw new Error(`Aggregation meta not found for ${aggregationName} and ${eventType}`);
    }

    console.log('Aggregation Meta:', aggregationMeta); // Log aggregation metadata

    const filterRules = aggregationMeta.filterRules || [];
    const filteredEvents = this.eventAggregator.events ? this.eventAggregator.events.filter((event) => this.eventAggregator.filterEvent(event, filterRules)) : [];

    console.log('Filtered Events:', filteredEvents); // Log events after filtering

    const result = this.eventAggregator.computeAggregation(filteredEvents, aggregationMeta);

    console.log('Computed Result:', result); // Log the computed aggregation result

    return result;
  }
}

module.exports = AggregationService;
