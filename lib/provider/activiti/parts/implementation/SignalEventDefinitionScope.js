'use strict';

var elementReferenceProperty = require('../../../bpmn/parts/implementation/ElementReferenceProperty');

module.exports = function(group, element, bpmnFactory, signalEventDefinition) {

  var SCOPE_OPTIONS = [
    { value: 'global', name: 'global' },
    { value: 'processInstance', name: 'processInstance' },
  ];

  group.entries = group.entries.concat(elementReferenceProperty(element, signalEventDefinition, bpmnFactory, {
    id: 'signal-element-scope',
    label: 'Signal Scope',
    referenceProperty: 'signalRef',
    modelProperty: 'activiti:scope',
    shouldValidate: true,
    selectOptions: SCOPE_OPTIONS
  }));

};
