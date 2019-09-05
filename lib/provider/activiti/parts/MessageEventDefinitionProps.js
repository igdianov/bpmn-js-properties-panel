'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
    eventDefinitionHelper = require('../../../helper/EventDefinitionHelper'),
    messageEventDefinitionCorrelationKey = require('./implementation/MessageEventDefinitionCorrelationKey');

var forEach = require('lodash/forEach');

module.exports = function(group, element, bpmnFactory, elementRegistry, translate) {
  var events = [
    'bpmn:IntermediateThrowEvent',
    'bpmn:BoundaryEvent',
    'bpmn:IntermediateCatchEvent',
    'bpmn:EndEvent'
  ];

  // Message Event Definition
  forEach(events, function(event) {
    if (is(element, event)) {
      var messageEventDefinition = eventDefinitionHelper.getMessageEventDefinition(element);

      if (messageEventDefinition) {
        messageEventDefinitionCorrelationKey(group, element, bpmnFactory, messageEventDefinition, translate);
      }
    }
  });

};