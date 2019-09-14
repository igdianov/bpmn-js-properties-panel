'use strict';

var entryFactory = require('../../../../factory/EntryFactory');
var cmdHelper = require('../../../../helper/CmdHelper');
var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

module.exports = function(group, element, bpmnFactory, messageEventDefinition, translate) {
  var bo = getBusinessObject(messageEventDefinition);

  var correlatioKeyEntry = entryFactory.textField({
    id: 'message-element-correlation-key',
    label: translate('Correlation Key'),
    modelProperty: 'correlationKey',

    get: function(element, node) {
      return {
        correlationKey: bo.get('activiti:correlationKey')
      };
    },

    set: function(element, values) {
      return cmdHelper.updateBusinessObject(messageEventDefinition, bo, {
        'activiti:correlationKey': values.correlationKey || undefined
      });
    }

  });

  group.entries = group.entries.concat(correlatioKeyEntry);

};
