'use strict';

var entryFactory = require('../../../../factory/EntryFactory');
var cmdHelper = require('../../../../helper/CmdHelper');
var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

module.exports = function(group, element, bpmnFactory, messageEventDefinition, translate) {

  var correlatioKeyEntry = entryFactory.textField({
    id: 'message-element-correlation-key',
    label: translate('Correlation Key'),
    modelProperty: 'correlationKey',

    get: function(element, node) {
      var bo = getBusinessObject(element);
      return {
        correlationKey: bo.get('activiti:correlationKey')
      };
    },

    set: function(element, values) {
      var bo = getBusinessObject(element);
      return cmdHelper.updateBusinessObject(element, bo, {
        'activiti:correlationKey': values.correlationKey || undefined
      });
    }

  });

  group.entries = group.entries.concat(correlatioKeyEntry);

};
