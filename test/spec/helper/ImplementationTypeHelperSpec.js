'use strict';

var BpmnModdle = require('bpmn-moddle').default;
var ActivitiBpmnModdle = require('activiti-bpmn-moddle/resources/activiti');

var ImplementationTypeHelper = require('lib/helper/ImplementationTypeHelper');

describe('implementation type', function() {

  var moddle = new BpmnModdle({
    activiti: ActivitiBpmnModdle
  });


  describe('service task like', function() {

    var serviceTask;

    beforeEach(function() {
      serviceTask = moddle.create('bpmn:ServiceTask');
    });


    it('should return default implementation type', function() {

      // when
      var type = ImplementationTypeHelper.getImplementationType(serviceTask);

      // then
      expect(type).to.equal('implementation');
    });


    it('should return class as implementation type', function() {

      // given
      serviceTask.set('activiti:class', 'foo');

      // when
      var type = ImplementationTypeHelper.getImplementationType(serviceTask);

      // then
      expect(type).to.equal('class');
    });


    it('should return delegate as implementation type', function() {

      // given
      serviceTask.set('activiti:delegateExpression', 'foo');

      // when
      var type = ImplementationTypeHelper.getImplementationType(serviceTask);

      // then
      expect(type).to.equal('delegateExpression');
    });


    it('should return expression as implementation type', function() {

      // given
      serviceTask.set('activiti:expression', 'foo');

      // when
      var type = ImplementationTypeHelper.getImplementationType(serviceTask);

      // then
      expect(type).to.equal('expression');
    });


    it('should return external as implementation type', function() {

      // given
      serviceTask.set('activiti:type', 'external');

      // when
      var type = ImplementationTypeHelper.getImplementationType(serviceTask);

      // then
      expect(type).to.equal('external');
    });


    it('should return connector as implementation type', function() {

      // given
      var extensionElements = moddle.create('bpmn:ExtensionElements');
      var connector = moddle.create('activiti:Connector');
      extensionElements.set('values', [ connector ]);
      serviceTask.set('extensionElements', extensionElements);

      // when
      var type = ImplementationTypeHelper.getImplementationType(serviceTask);

      // then
      expect(type).to.equal('connector');
    });


    describe('with multiple implementation types', function() {


      it('should return connector as implementation type', function() {

        // given
        var extensionElements = moddle.create('bpmn:ExtensionElements');
        var connector = moddle.create('activiti:Connector');
        extensionElements.set('values', [ connector ]);
        serviceTask.set('extensionElements', extensionElements);
        serviceTask.set('activiti:type', 'external');
        serviceTask.set('activiti:class', 'foo');
        serviceTask.set('activiti:delegateExpression', 'foo');
        serviceTask.set('activiti:expression', 'foo');

        // when
        var type = ImplementationTypeHelper.getImplementationType(serviceTask);

        // then
        expect(type).to.equals('connector');
      });


      it('should return external as implementation type', function() {

        // given
        serviceTask.set('activiti:type', 'external');
        serviceTask.set('activiti:class', 'foo');
        serviceTask.set('activiti:delegateExpression', 'foo');
        serviceTask.set('activiti:expression', 'foo');

        // when
        var type = ImplementationTypeHelper.getImplementationType(serviceTask);

        // then
        expect(type).to.equals('external');
      });


      it('should return class as implementation type', function() {

        // given
        serviceTask.set('activiti:class', 'foo');
        serviceTask.set('activiti:delegateExpression', 'foo');
        serviceTask.set('activiti:expression', 'foo');

        // when
        var type = ImplementationTypeHelper.getImplementationType(serviceTask);

        // then
        expect(type).to.equals('class');
      });


      it('should return delegateExpression as implementation type', function() {

        // given
        serviceTask.set('activiti:delegateExpression', 'foo');
        serviceTask.set('activiti:expression', 'foo');

        // when
        var type = ImplementationTypeHelper.getImplementationType(serviceTask);

        // then
        expect(type).to.equal('expression');
      });


    });

  });


  describe('business rule task', function() {

    var businessRuleTask;

    beforeEach(function() {
      businessRuleTask = moddle.create('bpmn:BusinessRuleTask');
    });

    it('should return no implementation type', function() {

      // when
      var type = ImplementationTypeHelper.getImplementationType(businessRuleTask);

      // then
      expect(type).to.be.undefined;
    });


    it('should return class as implementation type', function() {

      // given
      businessRuleTask.set('activiti:class', 'foo');

      // when
      var type = ImplementationTypeHelper.getImplementationType(businessRuleTask);

      // then
      expect(type).to.equal('class');
    });


    it('should return delegate as implementation type', function() {

      // given
      businessRuleTask.set('activiti:delegateExpression', 'foo');

      // when
      var type = ImplementationTypeHelper.getImplementationType(businessRuleTask);

      // then
      expect(type).to.equal('delegateExpression');
    });


    it('should return expression as implementation type', function() {

      // given
      businessRuleTask.set('activiti:expression', 'foo');

      // when
      var type = ImplementationTypeHelper.getImplementationType(businessRuleTask);

      // then
      expect(type).to.equal('expression');
    });


    it('should return connector as implementation type', function() {

      // given
      var extensionElements = moddle.create('bpmn:ExtensionElements');
      var connector = moddle.create('activiti:Connector');
      extensionElements.set('values', [ connector ]);
      businessRuleTask.set('extensionElements', extensionElements);

      // when
      var type = ImplementationTypeHelper.getImplementationType(businessRuleTask);

      // then
      expect(type).to.equal('connector');
    });


    it('should return dmn as implementation type', function() {

      // given
      businessRuleTask.set('activiti:decisionRef', 'foo');

      // when
      var type = ImplementationTypeHelper.getImplementationType(businessRuleTask);

      // then
      expect(type).to.equal('dmn');
    });


    describe('with multiple implementation types', function() {


      it('should return dmn as implementation type', function() {

        // given
        businessRuleTask.set('activiti:decisionRef', 'foo');
        var extensionElements = moddle.create('bpmn:ExtensionElements');
        var connector = moddle.create('activiti:Connector');
        extensionElements.set('values', [ connector ]);
        businessRuleTask.set('extensionElements', extensionElements);
        businessRuleTask.set('activiti:class', 'foo');
        businessRuleTask.set('activiti:delegateExpression', 'foo');
        businessRuleTask.set('activiti:expression', 'foo');

        // when
        var type = ImplementationTypeHelper.getImplementationType(businessRuleTask);

        // then
        expect(type).to.equals('dmn');
      });


      it('should return connector as implementation type', function() {

        // given
        var extensionElements = moddle.create('bpmn:ExtensionElements');
        var connector = moddle.create('activiti:Connector');
        extensionElements.set('values', [ connector ]);
        businessRuleTask.set('extensionElements', extensionElements);
        businessRuleTask.set('activiti:class', 'foo');
        businessRuleTask.set('activiti:delegateExpression', 'foo');
        businessRuleTask.set('activiti:expression', 'foo');

        // when
        var type = ImplementationTypeHelper.getImplementationType(businessRuleTask);

        // then
        expect(type).to.equals('connector');
      });


      it('should return class as implementation type', function() {

        // given
        businessRuleTask.set('activiti:class', 'foo');
        businessRuleTask.set('activiti:delegateExpression', 'foo');
        businessRuleTask.set('activiti:expression', 'foo');

        // when
        var type = ImplementationTypeHelper.getImplementationType(businessRuleTask);

        // then
        expect(type).to.equals('class');
      });


      it('should return expression as implementation type', function() {

        // given
        businessRuleTask.set('activiti:delegateExpression', 'foo');
        businessRuleTask.set('activiti:expression', 'foo');

        // when
        var type = ImplementationTypeHelper.getImplementationType(businessRuleTask);

        // then
        expect(type).to.equal('expression');
      });


    });

  });


  describe('execution listener', function() {

    var listener;

    beforeEach(function() {
      listener = moddle.create('activiti:ExecutionListener');
    });

    it('should return no implementation type', function() {

      // when
      var type = ImplementationTypeHelper.getImplementationType(listener);

      // then
      expect(type).to.be.undefined;
    });


    it('should return class as implementation type', function() {

      // given
      listener.set('activiti:class', 'foo');

      // when
      var type = ImplementationTypeHelper.getImplementationType(listener);

      // then
      expect(type).to.equal('class');
    });


    it('should return delegate as implementation type', function() {

      // given
      listener.set('activiti:delegateExpression', 'foo');

      // when
      var type = ImplementationTypeHelper.getImplementationType(listener);

      // then
      expect(type).to.equal('delegateExpression');
    });


    it('should return expression as implementation type', function() {

      // given
      listener.set('activiti:expression', 'foo');

      // when
      var type = ImplementationTypeHelper.getImplementationType(listener);

      // then
      expect(type).to.equal('expression');
    });


    it('should return script as implementation type', function() {

      // given
      var script = moddle.create('activiti:Script');
      listener.set('activiti:script', script);

      // when
      var type = ImplementationTypeHelper.getImplementationType(listener);

      // then
      expect(type).to.equal('script');
    });


    describe('with multiple implementation types', function() {


      it('should return class as implementation type', function() {

        // given
        listener.set('activiti:class', 'foo');
        listener.set('activiti:delegateExpression', 'foo');
        listener.set('activiti:expression', 'foo');
        var script = moddle.create('activiti:Script');
        listener.set('activiti:script', script);

        // when
        var type = ImplementationTypeHelper.getImplementationType(listener);

        // then
        expect(type).to.equals('class');
      });


      it('should return expression as implementation type', function() {

        // given
        listener.set('activiti:delegateExpression', 'foo');
        listener.set('activiti:expression', 'foo');
        var script = moddle.create('activiti:Script');
        listener.set('activiti:script', script);

        // when
        var type = ImplementationTypeHelper.getImplementationType(listener);

        // then
        expect(type).to.equal('expression');
      });


      it('should return delegateExpression as implementation type', function() {

        // given
        listener.set('activiti:delegateExpression', 'foo');
        var script = moddle.create('activiti:Script');
        listener.set('activiti:script', script);

        // when
        var type = ImplementationTypeHelper.getImplementationType(listener);

        // then
        expect(type).to.equal('delegateExpression');
      });

    });

  });


  describe('message event definition', function() {

    var messageEvent, messageEventDefinition;

    beforeEach(function() {
      messageEvent = moddle.create('bpmn:IntermediateThrowEvent');
      messageEventDefinition = moddle.create('bpmn:MessageEventDefinition');
      messageEvent.set('eventDefinitions', [ messageEventDefinition ]);
    });


    it('should return message event definition', function() {

      // when
      var bo = ImplementationTypeHelper.getServiceTaskLikeBusinessObject(messageEvent);

      // then
      expect(bo.$instanceOf('bpmn:MessageEventDefinition')).to.be.true;

    });


    it('should return no implementation type', function() {

      // when
      var type = ImplementationTypeHelper.getImplementationType(messageEvent);

      // then
      expect(type).to.be.undefined;
    });


    it('should return class as implementation type', function() {

      // given
      messageEventDefinition.set('activiti:class', 'foo');

      // when
      var type = ImplementationTypeHelper.getImplementationType(messageEvent);

      // then
      expect(type).to.equal('class');
    });


    it('should return delegate as implementation type', function() {

      // given
      messageEventDefinition.set('activiti:delegateExpression', 'foo');

      // when
      var type = ImplementationTypeHelper.getImplementationType(messageEvent);

      // then
      expect(type).to.equal('delegateExpression');
    });


    it('should return expression as implementation type', function() {

      // given
      messageEventDefinition.set('activiti:expression', 'foo');

      // when
      var type = ImplementationTypeHelper.getImplementationType(messageEvent);

      // then
      expect(type).to.equal('expression');
    });


    it('should return connector as implementation type', function() {

      // given
      var extensionElements = moddle.create('bpmn:ExtensionElements');
      var connector = moddle.create('activiti:Connector');
      extensionElements.set('values', [ connector ]);
      messageEventDefinition.set('extensionElements', extensionElements);

      // when
      var type = ImplementationTypeHelper.getImplementationType(messageEvent);

      // then
      expect(type).to.equal('connector');
    });


    describe('with multiple implementation types', function() {


      it('should return connector as implementation type', function() {

        // given
        var extensionElements = moddle.create('bpmn:ExtensionElements');
        var connector = moddle.create('activiti:Connector');
        extensionElements.set('values', [ connector ]);
        messageEventDefinition.set('extensionElements', extensionElements);
        messageEventDefinition.set('activiti:class', 'foo');
        messageEventDefinition.set('activiti:delegateExpression', 'foo');
        messageEventDefinition.set('activiti:expression', 'foo');

        // when
        var type = ImplementationTypeHelper.getImplementationType(messageEvent);

        // then
        expect(type).to.equals('connector');
      });


      it('should return class as implementation type', function() {

        // given
        messageEventDefinition.set('activiti:class', 'foo');
        messageEventDefinition.set('activiti:delegateExpression', 'foo');
        messageEventDefinition.set('activiti:expression', 'foo');

        // when
        var type = ImplementationTypeHelper.getImplementationType(messageEvent);

        // then
        expect(type).to.equals('class');
      });


      it('should return expression as implementation type', function() {

        // given
        messageEventDefinition.set('activiti:delegateExpression', 'foo');
        messageEventDefinition.set('activiti:expression', 'foo');

        // when
        var type = ImplementationTypeHelper.getImplementationType(messageEvent);

        // then
        expect(type).to.equal('expression');
      });


    });

  });

});