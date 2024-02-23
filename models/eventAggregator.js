class EventAggregator {
  constructor() {
    this.events = [];
    this.aggregationMeta = [];
  }

  createMeta(aggregationMeta) {
    this.aggregationMeta.push(aggregationMeta);
  }

  getAggregation(aggregationName, eventType) {
    const aggregationMeta = this.aggregationMeta.find(
      (meta) => meta.aggregationName === aggregationName && meta.eventType === eventType
    );

    if (!aggregationMeta) {
      throw new Error(`Aggregation meta not found for ${aggregationName} and ${eventType}`);
    }

    if (!this.events) {
      throw new Error(`Events array is not properly initialized`);
    }

    const filterRules = aggregationMeta.filterRules || [];

    // Perform aggregation logic based on aggregationMeta
    const result = this.computeAggregation(this.events.filter((event) => this.filterEvent(event, filterRules)), aggregationMeta);

    return result; // Return the computed result
  }

  computeAggregation(events, aggregationMeta) {
    if (aggregationMeta.aggregationType === 'count') {
      // For count aggregation, return the count of filtered events
      return events.length;
    } else if (aggregationMeta.aggregationType === 'sum') {
      // For sum aggregation, calculate the sum of the specified field in filtered events
      const sum = events.reduce((accumulator, event) => {
        const fieldValue = this.getFieldValue(event, aggregationMeta.aggregationField);
        return accumulator + (fieldValue || 0); // Ensure fieldValue is a number or default to 0
      }, 0);

      return sum;
    } else {
      throw new Error(`Unsupported aggregation type: ${aggregationMeta.aggregationType}`);
    }
  }

  // filterEvent(event, filterRules) {
  //   // If no filter rules are provided, consider the event as passing the filter
  //   if (!filterRules || filterRules.length === 0) {
  //     return true;
  //   }

  //   // Iterate through each filter rule and check if the event satisfies it
  //   for (const rule of filterRules) {
  //     const { field, op, value } = rule;

  //     // Access the corresponding field value in the event data
  //     const fieldValue = this.getFieldValue(event, field);

  //     // Check if the field value satisfies the filter rule
  //     if (!this.applyFilterOperator(fieldValue, op, value)) {
  //       // If any rule is not satisfied, return false
  //       return false;
  //     }
  //   }

  //   // If all filter rules are satisfied, return true
  //   return true;
  // }

  filterEvent(event, filterRules) {
    // If no filter rules are provided, consider the event as passing the filter
    if (!filterRules || filterRules.length === 0) {
      return true;
    }
  
    // Iterate through each filter rule and check if the event satisfies it
    for (const rule of filterRules) {
      const { field, op, value } = rule;
  
      // Access the corresponding field value in the event data
      const fieldValue = this.getFieldValue(event, field);
  
      // Check if the field value satisfies the filter rule
      if (!this.applyFilterOperator(fieldValue, op, value)) {
        // If any rule is not satisfied, return false
        return false;
      }
    }
  
    // If all filter rules are satisfied, return true
    return true;
  }
  

  getFieldValue(event, fieldPath) {
    // Helper method to get the value of a field in the event data using a JSON path
    // For simplicity, this implementation assumes a flat structure of eventData

    if (!event || !event.eventData) {
      return undefined; // Return undefined if event or eventData is not truthy
    }

    const fieldKeys = fieldPath.split('.');
    let fieldValue = event.eventData;

    for (const key of fieldKeys) {
      if (!fieldValue.hasOwnProperty(key)) {
        return undefined; // Return undefined if the field doesn't exist
      }
      fieldValue = fieldValue[key];
    }

    return fieldValue;
  }

  applyFilterOperator(fieldValue, operator, targetValue) {
    // Helper method to apply the filter operator to compare field value with target value

    switch (operator) {
      case 'eq':
        return fieldValue === targetValue;
      case 'gt':
        return fieldValue > targetValue;
      case 'lt':
        return fieldValue < targetValue;
      default:
        return false;
    }
  }
}

module.exports = EventAggregator;
