'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
    eventDefinitionHelper = require('../../../helper/EventDefinitionHelper'),
    signalEventDefinitionScope = require('./implementation/SignalEventDefinitionScope');

var forEach = require('lodash/forEach');

module.exports = function(group, element, bpmnFactory, elementRegistry, translate) {
  var events = [
    'bpmn:IntermediateThrowEvent',
    'bpmn:BoundaryEvent',
    'bpmn:IntermediateCatchEvent'
  ];

  // Message and Signal Event Definition
  forEach(events, function(event) {
    if (is(element, event)) {
      var signalEventDefinition = eventDefinitionHelper.getSignalEventDefinition(element);

      if (signalEventDefinition) {
        signalEventDefinitionScope(group, element, bpmnFactory, signalEventDefinition, translate);
      }
    }
  });

};