'use strict';

var elementReferenceProperty = require('../../../bpmn/parts/implementation/ElementReferenceProperty');

module.exports = function(group, element, bpmnFactory, signalEventDefinition) {

  group.entries = group.entries.concat(elementReferenceProperty(element, signalEventDefinition, bpmnFactory, {
    id: 'signal-element-scope',
    label: 'Signal Scope',
    referenceProperty: 'signalRef',
    modelProperty: 'activiti:scope',
    shouldValidate: true
  }));

};
