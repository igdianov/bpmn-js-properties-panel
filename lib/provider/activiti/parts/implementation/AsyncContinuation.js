'use strict';

var assign = require('lodash/assign');

var entryFactory = require('../../../../factory/EntryFactory');

var asyncCapableHelper = require('../../../../helper/AsyncCapableHelper'),
    eventDefinitionHelper = require('../../../../helper/EventDefinitionHelper'),
    cmdHelper = require('../../../../helper/CmdHelper');

function isActivitiAsync(bo) {
  return asyncCapableHelper.isActivitiAsync(bo);
}

function isExclusive(bo) {
  return asyncCapableHelper.isExclusive(bo);
}

function removeFailedJobRetryTimeCycle(bo, element) {
  return asyncCapableHelper.removeFailedJobRetryTimeCycle(bo, element);
}

function canRemoveFailedJobRetryTimeCycle(element) {
  return !eventDefinitionHelper.getTimerEventDefinition(element);
}

module.exports = function(element, bpmnFactory, options, translate) {

  var getBusinessObject = options.getBusinessObject;

  var idPrefix = options.idPrefix || '',
      labelPrefix = options.labelPrefix || '';

  var activitiAsyncEntry = entryFactory.checkbox({
    id: idPrefix + 'async',
    label: labelPrefix + translate('Asynchronous'),
    modelProperty: 'async',

    get: function(element, node) {
      var bo = getBusinessObject(element);
      return {
        async: isActivitiAsync(bo)
      };
    },

    set: function(element, values) {
      var bo = getBusinessObject(element);
      var asyncValue = !!values.async;

      var props = {
        'activiti:async': asyncValue
      };

      var commands = [];
      if (!asyncValue) {
        props = assign({ 'activiti:exclusive' : true }, props);
        if (canRemoveFailedJobRetryTimeCycle(element)) {
          commands.push(removeFailedJobRetryTimeCycle(bo, element));
        }
      }

      commands.push(cmdHelper.updateBusinessObject(element, bo, props));
      return commands;
    }
  });

  var exclusiveEntry = entryFactory.checkbox({
    id: idPrefix + 'exclusive',
    label: labelPrefix + translate('Exclusive'),
    modelProperty: 'exclusive',

    get: function(element, node) {
      var bo = getBusinessObject(element);
      return { exclusive: isExclusive(bo) };
    },

    set: function(element, values) {
      var bo = getBusinessObject(element);
      return cmdHelper.updateBusinessObject(element, bo, { 'activiti:exclusive': !!values.exclusive });
    },

    hidden: function(element) {
      var bo = getBusinessObject(element);
      return bo && !isActivitiAsync(bo);
    }
  });

  return [ activitiAsyncEntry, exclusiveEntry ];
};
