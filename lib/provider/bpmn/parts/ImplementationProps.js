'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

var entryFactory = require('../../../factory/EntryFactory');

module.exports = function(group, element, translate) {

  var bo = getBusinessObject(element);

  if (!bo) {
    return;
  }

  if (is(element, 'bpmn:ServiceTask')) {

    var entry = entryFactory.textBox({
      id: 'service-task-implementation',
      label: translate('bpmn:Implementation'),
      modelProperty: 'implementation'
    });

    group.entries.push(entry);
  }

};
