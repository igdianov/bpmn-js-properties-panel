'use strict';

var TestHelper = require('../../../../../TestHelper');

var TestContainer = require('mocha-test-container-support');

/* global bootstrapModeler, inject */

var coreModule = require('bpmn-js/lib/core').default,
    modelingModule = require('bpmn-js/lib/features/modeling').default,
    propertiesPanelCommandsModule = require('lib/cmd'),
    elementTemplatesModule = require('lib/provider/activiti/element-templates'),
    activitiModdlePackage = require('activiti-bpmn-moddle/resources/activiti');

var Helper = require('lib/provider/activiti/element-templates/Helper');

var findExtension = Helper.findExtension,
    findExtensions = Helper.findExtensions;


describe('element-templates - cmd', function() {

  var container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });


  describe('should apply element template', function() {

    describe('setting bpmn:conditionExpression', function() {

      var diagramXML = require('./sequenceFlow-clean.bpmn');

      var newTemplate = require('./vip-path');

      beforeEach(bootstrapModeler(diagramXML, {
        container: container,
        modules: [
          coreModule,
          modelingModule,
          propertiesPanelCommandsModule,
          elementTemplatesModule
        ],
        moddleExtensions: {
          activiti: activitiModdlePackage
        }
      }));


      it('execute', inject(function(elementRegistry) {

        // given
        var sequenceFlowConnection = elementRegistry.get('SequenceFlow_1'),
            sequenceFlow = sequenceFlowConnection.businessObject;

        // when
        applyTemplate(sequenceFlowConnection, newTemplate);

        var conditionExpression = sequenceFlow.conditionExpression,
            elementTemplate = sequenceFlow.modelerTemplate;

        // then
        expect(conditionExpression).to.exist;
        expect(conditionExpression.$type).to.eql('bpmn:FormalExpression');
        expect(conditionExpression.body).to.eql('${ customer.vip }');
        expect(elementTemplate).to.exist;
        expect(elementTemplate).to.equal('e.com.merce.FastPath');
      }));


      it('undo', inject(function(elementRegistry, commandStack) {

        // given
        var sequenceFlowConnection = elementRegistry.get('SequenceFlow_1'),
            sequenceFlow = sequenceFlowConnection.businessObject;

        applyTemplate(sequenceFlowConnection, newTemplate);


        // when
        commandStack.undo();

        var condition = sequenceFlow.conditionExpression,
            elementTemplate = sequenceFlow.modelerTemplate;

        // then
        expect(condition).not.to.exist;
        expect(elementTemplate).not.to.exist;
      }));

    });


    describe('setting activiti:async', function() {

      var diagramXML = require('./task-clean.bpmn');

      var newTemplate = require('./better-async-task');

      beforeEach(bootstrapModeler(diagramXML, {
        container: container,
        modules: [
          coreModule,
          modelingModule,
          propertiesPanelCommandsModule,
          elementTemplatesModule
        ],
        moddleExtensions: {
          activiti: activitiModdlePackage
        }
      }));


      it('execute', inject(function(elementRegistry) {

        // given
        var taskShape = elementRegistry.get('Task_1'),
            task = taskShape.businessObject;

        // when
        applyTemplate(taskShape, newTemplate);

        var activitiAsync = task.get('activiti:async'),
            elementTemplate = task.modelerTemplate;

        // then
        expect(activitiAsync).to.be.true;
        expect(elementTemplate).to.exist;
        expect(elementTemplate).to.equal('my.awesome.Task');
      }));


      it('undo', inject(function(elementRegistry, commandStack) {

        // given
        var taskShape = elementRegistry.get('Task_1'),
            task = taskShape.businessObject;

        applyTemplate(taskShape, newTemplate);


        // when
        commandStack.undo();

        var activitiAsync = task.get('activiti:async'),
            elementTemplate = task.modelerTemplate;

        // then
        expect(activitiAsync).to.be.false;
        expect(elementTemplate).not.to.exist;
      }));

    });


    describe('setting activiti:inputOutput', function() {

      var diagramXML = require('./task-clean.bpmn');

      var newTemplate = require('./mail-task');

      beforeEach(bootstrapModeler(diagramXML, {
        container: container,
        modules: [
          coreModule,
          modelingModule,
          propertiesPanelCommandsModule,
          elementTemplatesModule
        ],
        moddleExtensions: {
          activiti: activitiModdlePackage
        }
      }));


      it('execute', inject(function(elementRegistry) {

        // given
        var taskShape = elementRegistry.get('Task_1'),
            task = taskShape.businessObject;

        // when
        applyTemplate(taskShape, newTemplate);

        var inputOutput = findExtension(taskShape, 'activiti:InputOutput'),
            elementTemplate = task.modelerTemplate;

        // then
        expect(inputOutput).to.exist;

        expect(inputOutput.inputParameters).to.jsonEqual([
          {
            $type: 'activiti:InputParameter',
            name: 'recipient'
          },
          {
            $type: 'activiti:InputParameter',
            name: 'messageBody',
            definition: {
              $type: 'activiti:Script',
              scriptFormat: 'freemarker',
              value: 'Hello ${firstName}!'
            }
          },
          {
            $type: 'activiti:InputParameter',
            name: 'hiddenField',
            value: 'SECRET'
          }
        ]);

        expect(inputOutput.outputParameters).to.jsonEqual([
          {
            $type: 'activiti:OutputParameter',
            name: 'mailResult',
            definition: {
              $type: 'activiti:Script',
              scriptFormat: 'freemarker',
              value: '${mailResult}'
            }
          }
        ]);

        expect(elementTemplate).to.exist;
        expect(elementTemplate).to.equal('my.mail.Task');
      }));


      it('undo', inject(function(elementRegistry, commandStack) {

        // given
        var taskShape = elementRegistry.get('Task_1'),
            task = taskShape.businessObject;

        applyTemplate(taskShape, newTemplate);

        // when
        commandStack.undo();

        var inputOutput = findExtension(taskShape, 'activiti:InputOutput'),
            elementTemplate = task.modelerTemplate;

        // then
        expect(inputOutput).not.to.exist;
        expect(elementTemplate).not.to.exist;
      }));

    });


    describe('setting activiti:in / activiti:out', function() {

      var diagramXML = require('./call-activity.bpmn');

      var newTemplate = require('./call-activity-mapped');

      beforeEach(bootstrapModeler(diagramXML, {
        container: container,
        modules: [
          coreModule,
          modelingModule,
          propertiesPanelCommandsModule,
          elementTemplatesModule
        ],
        moddleExtensions: {
          activiti: activitiModdlePackage
        }
      }));


      it('execute', inject(function(elementRegistry) {

        // given
        var callActitvityShape = elementRegistry.get('CallActivity_1'),
            callActivity = callActitvityShape.businessObject;

        // when
        applyTemplate(callActitvityShape, newTemplate);

        var inOuts = findExtensions(callActitvityShape, [ 'activiti:In', 'activiti:Out' ]),
            elementTemplate = callActivity.modelerTemplate;

        // then
        expect(inOuts).to.exist;

        expect(inOuts).to.jsonEqual([
          { $type: 'activiti:In', target: 'var_called_source', source: 'var_local' },
          { $type: 'activiti:Out', target: 'var_called', source: 'var_local_source' },
          { $type: 'activiti:In', target: 'var_called_expr', sourceExpression: '${expr_local}' },
          { $type: 'activiti:Out', target: 'var_local_expr', sourceExpression: '${expr_called}' },
          { $type: 'activiti:In', variables: 'all' },
          { $type: 'activiti:Out', variables: 'all' },
          { $type: 'activiti:In', variables: 'all', local: true },
          { $type: 'activiti:Out', variables: 'all', local: true },
          { $type: 'activiti:In', businessKey: '${execution.processBusinessKey}' }
        ]);

        expect(elementTemplate).to.exist;
        expect(elementTemplate).to.equal('my.Caller');
      }));


      it('undo', inject(function(elementRegistry, commandStack) {

        // given
        var callActitvityShape = elementRegistry.get('CallActivity_1'),
            callActivity = callActitvityShape.businessObject;

        applyTemplate(callActitvityShape, newTemplate);

        // when
        commandStack.undo();

        var inOuts = findExtensions(callActitvityShape, [ 'activiti:In', 'activiti:Out' ]),
            elementTemplate = callActivity.modelerTemplate;

        // then
        expect(inOuts).to.have.length(2);
        expect(elementTemplate).not.to.exist;
      }));

    });


    describe('setting activiti:properties', function() {

      var diagramXML = require('./task-clean.bpmn');

      var newTemplate = require('./ws-properties');

      beforeEach(bootstrapModeler(diagramXML, {
        container: container,
        modules: [
          coreModule,
          modelingModule,
          propertiesPanelCommandsModule,
          elementTemplatesModule
        ],
        moddleExtensions: {
          activiti: activitiModdlePackage
        }
      }));


      it('execute', inject(function(elementRegistry) {

        // given
        var taskShape = elementRegistry.get('Task_1'),
            task = taskShape.businessObject;

        // when
        applyTemplate(taskShape, newTemplate);

        var properties = findExtension(taskShape, 'activiti:Properties'),
            elementTemplate = task.modelerTemplate;

        // then
        expect(properties).to.exist;

        expect(properties.values).to.jsonEqual([
          {
            $type: 'activiti:Property',
            name: 'webServiceUrl',
            value: ''
          }
        ]);

        expect(elementTemplate).to.exist;
        expect(elementTemplate).to.equal('com.mycompany.WsCaller');
      }));


      it('undo', inject(function(elementRegistry, commandStack) {

        // given
        var taskShape = elementRegistry.get('Task_1'),
            task = taskShape.businessObject;

        applyTemplate(taskShape, newTemplate);

        // when
        commandStack.undo();

        var properties = findExtension(taskShape, 'activiti:Properties'),
            elementTemplate = task.modelerTemplate;

        // then
        expect(properties).not.to.exist;
        expect(elementTemplate).not.to.exist;
      }));

    });


    describe('with scope connector', function() {

      var diagramXML = require('./task-clean.bpmn');

      var newTemplate = require('./connector-task');

      beforeEach(bootstrapModeler(diagramXML, {
        container: container,
        modules: [
          coreModule,
          modelingModule,
          propertiesPanelCommandsModule,
          elementTemplatesModule
        ],
        moddleExtensions: {
          activiti: activitiModdlePackage
        }
      }));


      it('execute', inject(function(elementRegistry) {

        // given
        var taskShape = elementRegistry.get('Task_1'),
            task = taskShape.businessObject;

        // when
        applyTemplate(taskShape, newTemplate);

        var connector = findExtension(taskShape, 'activiti:Connector');
        var inputOutput = connector.get('inputOutput');
        var elementTemplate = task.modelerTemplate;

        // then
        expect(connector).to.exist;

        expect(connector.get('connectorId')).to.equal('My Connector HTTP - GET');

        expect(inputOutput).to.exist;

        expect(inputOutput.inputParameters).to.jsonEqual([
          {
            $type: 'activiti:InputParameter',
            name: 'method',
            value: 'GET'
          },
          {
            $type: 'activiti:InputParameter',
            name: 'url',
            value: 'https://bpmn.io'
          }
        ]);

        expect(inputOutput.outputParameters).to.jsonEqual([
          {
            $type: 'activiti:OutputParameter',
            name: 'wsResponse',
            definition: {
              $type: 'activiti:Script',
              scriptFormat: 'freemarker',
              value: '${S(response)}'
            }
          }
        ]);

        expect(elementTemplate).to.exist;
        expect(elementTemplate).to.equal('my.connector.http.get.Task');
      }));


      it('undo', inject(function(elementRegistry, commandStack) {

        // given
        var taskShape = elementRegistry.get('Task_1'),
            task = taskShape.businessObject;

        applyTemplate(taskShape, newTemplate);

        // when
        commandStack.undo();

        var connector = findExtension(taskShape, 'activiti:Connector');
        var elementTemplate = task.modelerTemplate;

        // then
        expect(connector).not.to.exist;
        expect(elementTemplate).not.to.exist;
      }));

    });


    describe('override behavior', function() {

      describe('activiti:executionListener', function() {

        var diagramXML = require('./task-execution-listener.bpmn');

        var newTemplate = require('./ws-properties');

        beforeEach(bootstrapModeler(diagramXML, {
          container: container,
          modules: [
            coreModule,
            modelingModule,
            propertiesPanelCommandsModule,
            elementTemplatesModule
          ],
          moddleExtensions: {
            activiti: activitiModdlePackage
          }
        }));


        it('should keep old if unspecified', inject(function(elementRegistry) {

          // given
          var taskShape = elementRegistry.get('Task_1'),
              task = taskShape.businessObject;

          // when
          applyTemplate(taskShape, newTemplate);

          var executionListeners = findExtensions(taskShape, [ 'activiti:ExecutionListener' ]),
              elementTemplate = task.modelerTemplate;

          // then
          expect(executionListeners).to.jsonEqual([
            {
              $type: 'activiti:ExecutionListener',
              class: 'foo.Bar',
              event: 'start'
            }
          ]);

          expect(elementTemplate).to.exist;
          expect(elementTemplate).to.equal('com.mycompany.WsCaller');
        }));

      });

    });

  });


  describe('should unset element template', function() {

    describe('with bpmn:conditionExpression', function() {

      var diagramXML = require('./sequenceFlow-clean.bpmn');

      var currentTemplate = require('./vip-path');

      beforeEach(bootstrapModeler(diagramXML, {
        container: container,
        modules: [
          coreModule,
          modelingModule,
          propertiesPanelCommandsModule,
          elementTemplatesModule
        ],
        moddleExtensions: {
          activiti: activitiModdlePackage
        }
      }));

      beforeEach(inject(function(elementRegistry) {
        var sequenceFlowConnection = elementRegistry.get('SequenceFlow_1');

        applyTemplate(sequenceFlowConnection, currentTemplate);
      }));


      it('execute', inject(function(elementRegistry) {

        // given
        var sequenceFlowConnection = elementRegistry.get('SequenceFlow_1'),
            sequenceFlow = sequenceFlowConnection.businessObject;

        // when
        applyTemplate(sequenceFlowConnection, null);

        var conditionExpression = sequenceFlow.conditionExpression,
            elementTemplate = sequenceFlow.modelerTemplate;

        // then
        expect(sequenceFlow.get('activiti:modelerTemplate')).not.to.exist;

        // removing a sequence flow template does
        // not change the applied values
        expect(conditionExpression).to.exist;
        expect(conditionExpression.$type).to.eql('bpmn:FormalExpression');
        expect(conditionExpression.body).to.eql('${ customer.vip }');
        expect(elementTemplate).not.to.exist;
      }));


      it('undo', inject(function(elementRegistry, commandStack) {

        // given
        var sequenceFlowConnection = elementRegistry.get('SequenceFlow_1'),
            sequenceFlow = sequenceFlowConnection.businessObject;

        applyTemplate(sequenceFlowConnection, null);


        // when
        commandStack.undo();

        var conditionExpression = sequenceFlow.conditionExpression,
            elementTemplate = sequenceFlow.modelerTemplate;

        // then
        expect(sequenceFlow.get('activiti:modelerTemplate')).to.eql(currentTemplate.id);

        expect(conditionExpression).to.exist;
        expect(conditionExpression.$type).to.eql('bpmn:FormalExpression');
        expect(conditionExpression.body).to.eql('${ customer.vip }');

        expect(elementTemplate).to.exist;
        expect(elementTemplate).to.equal('e.com.merce.FastPath');
      }));

    });


    describe('with activiti:async', function() {

      var diagramXML = require('./task-clean.bpmn');

      var currentTemplate = require('./better-async-task');

      beforeEach(bootstrapModeler(diagramXML, {
        container: container,
        modules: [
          coreModule,
          modelingModule,
          propertiesPanelCommandsModule,
          elementTemplatesModule
        ],
        moddleExtensions: {
          activiti: activitiModdlePackage
        }
      }));


      beforeEach(inject(function(elementRegistry) {
        var taskShape = elementRegistry.get('Task_1');

        applyTemplate(taskShape, currentTemplate);
      }));


      it('execute', inject(function(elementRegistry) {

        // given
        var taskShape = elementRegistry.get('Task_1'),
            task = taskShape.businessObject;

        // when
        applyTemplate(taskShape, null);

        // then
        expect(task.get('activiti:modelerTemplate')).not.to.exist;

        // removing a task template does
        // not change the applied values
        expect(task.get('activiti:async')).to.be.true;
      }));


      it('undo', inject(function(elementRegistry, commandStack) {

        // given
        var taskShape = elementRegistry.get('Task_1'),
            task = taskShape.businessObject;

        applyTemplate(taskShape, null);

        // when
        commandStack.undo();

        // then
        expect(task.get('activiti:modelerTemplate')).to.eql(currentTemplate.id);

        expect(task.get('activiti:async')).to.be.true;
      }));

    });


    describe('with activiti:inputOutput', function() {

      var diagramXML = require('./task-clean.bpmn');

      var currentTemplate = require('./mail-task');

      beforeEach(bootstrapModeler(diagramXML, {
        container: container,
        modules: [
          coreModule,
          modelingModule,
          propertiesPanelCommandsModule,
          elementTemplatesModule
        ],
        moddleExtensions: {
          activiti: activitiModdlePackage
        }
      }));

      beforeEach(inject(function(elementRegistry) {
        var taskShape = elementRegistry.get('Task_1');

        applyTemplate(taskShape, currentTemplate);
      }));


      it('execute', inject(function(elementRegistry) {

        // given
        var taskShape = elementRegistry.get('Task_1'),
            task = taskShape.businessObject;

        // when
        applyTemplate(taskShape, null);

        var inputOutput = findExtension(taskShape, 'activiti:InputOutput');

        // then
        expect(task.get('activiti:modelerTemplate')).not.to.exist;

        // removing a task template does
        // not change the applied values
        expect(inputOutput).to.exist;

        expect(inputOutput.inputParameters).to.jsonEqual([
          {
            $type: 'activiti:InputParameter',
            name: 'recipient'
          },
          {
            $type: 'activiti:InputParameter',
            name: 'messageBody',
            definition: {
              $type: 'activiti:Script',
              scriptFormat: 'freemarker',
              value: 'Hello ${firstName}!'
            }
          },
          {
            $type: 'activiti:InputParameter',
            name: 'hiddenField',
            value: 'SECRET'
          }
        ]);

        expect(inputOutput.outputParameters).to.jsonEqual([
          {
            $type: 'activiti:OutputParameter',
            name: 'mailResult',
            definition: {
              $type: 'activiti:Script',
              scriptFormat: 'freemarker',
              value: '${mailResult}'
            }
          }
        ]);
      }));


      it('undo', inject(function(elementRegistry, commandStack) {

        // given
        var taskShape = elementRegistry.get('Task_1'),
            task = taskShape.businessObject;

        applyTemplate(taskShape, null);


        // when
        commandStack.undo();

        var inputOutput = findExtension(taskShape, 'activiti:InputOutput');

        // then
        expect(task.get('activiti:modelerTemplate')).to.eql(currentTemplate.id);

        expect(inputOutput).to.exist;
      }));

    });


    describe('with activiti:field', function() {

      var diagramXML = require('./task-clean.bpmn');

      var currentTemplate = require('./field-injections');

      beforeEach(bootstrapModeler(diagramXML, {
        container: container,
        modules: [
          coreModule,
          modelingModule,
          propertiesPanelCommandsModule,
          elementTemplatesModule
        ],
        moddleExtensions: {
          activiti: activitiModdlePackage
        }
      }));

      beforeEach(inject(function(elementRegistry) {
        var taskShape = elementRegistry.get('Task_1');

        applyTemplate(taskShape, currentTemplate);
      }));


      it('execute', inject(function(elementRegistry) {

        // given
        var taskShape = elementRegistry.get('Task_1'),
            task = taskShape.businessObject;

        // when
        applyTemplate(taskShape, null);

        var fieldInjections = findExtensions(taskShape, [ 'activiti:Field' ]);

        // then
        expect(task.get('activiti:modelerTemplate')).not.to.exist;

        // removing a task template does
        // not change the applied values
        expect(fieldInjections).to.exist;
        expect(fieldInjections).to.jsonEqual([
          {
            $type: 'activiti:Field',
            string: 'My String Field Injection',
            name: 'sender'
          },
          {
            $type: 'activiti:Field',
            string: 'My String Field Injection 2',
            name: 'sender2'
          },
          {
            $type: 'activiti:Field',
            expression: '${PerfectExpression}',
            name: 'sender3'
          }
        ]);
      }));


      it('undo', inject(function(elementRegistry, commandStack) {

        // given
        var taskShape = elementRegistry.get('Task_1'),
            task = taskShape.businessObject;

        applyTemplate(taskShape, null);


        // when
        commandStack.undo();

        var fieldInjections = findExtensions(taskShape, [ 'activiti:Field' ]);

        // then
        expect(task.get('activiti:modelerTemplate')).to.eql(currentTemplate.id);

        expect(fieldInjections).to.exist;
      }));

    });


    describe('setting activiti:field with existing fields', function() {

      var diagramXML = require('./task-field-injections.bpmn');

      var fieldInjectionsTemplate = require('./field-injections');

      beforeEach(bootstrapModeler(diagramXML, {
        container: container,
        modules: [
          coreModule,
          modelingModule,
          propertiesPanelCommandsModule,
          elementTemplatesModule
        ],
        moddleExtensions: {
          activiti: activitiModdlePackage
        }
      }));


      it('execute', inject(function(elementRegistry) {

        // given
        var taskShape = elementRegistry.get('Task_1');

        // when
        applyTemplate(taskShape, fieldInjectionsTemplate);

        var fieldInjections = findExtensions(taskShape, [ 'activiti:Field' ]);

        // then
        expect(fieldInjections).to.exist;

        expect(fieldInjections).to.jsonEqual([
          {
            $type: 'activiti:Field',
            string: 'My String Field Injection',
            name: 'sender'
          },
          {
            $type: 'activiti:Field',
            string: 'My String Field Injection 2',
            name: 'sender2'
          },
          {
            $type: 'activiti:Field',
            expression: '${PerfectExpression}',
            name: 'sender3'
          }
        ]);
      }));


      it('undo', inject(function(elementRegistry, commandStack) {

        // given
        var taskShape = elementRegistry.get('Task_1');

        applyTemplate(taskShape, fieldInjectionsTemplate);


        // when
        commandStack.undo();

        var fieldInjections = findExtensions(taskShape, [ 'activiti:Field' ]);

        // then
        expect(fieldInjections).to.exist;

        expect(fieldInjections).to.jsonEqual([
          {
            $type: 'activiti:Field',
            name: 'existingField',
            string: 'myString'
          },
          {
            $type: 'activiti:Field',
            name: 'existingFieldExpression',
            expression: '${myStringExpression}'
          }
        ]);
      }));

    });


    describe('with scope connector', function() {

      var diagramXML = require('./task-clean.bpmn');

      var currentTemplate = require('./connector-task');

      beforeEach(bootstrapModeler(diagramXML, {
        container: container,
        modules: [
          coreModule,
          modelingModule,
          propertiesPanelCommandsModule,
          elementTemplatesModule
        ],
        moddleExtensions: {
          activiti: activitiModdlePackage
        }
      }));

      beforeEach(inject(function(elementRegistry) {
        var taskShape = elementRegistry.get('Task_1');

        applyTemplate(taskShape, currentTemplate);
      }));


      it('execute', inject(function(elementRegistry) {

        // given
        var taskShape = elementRegistry.get('Task_1'),
            task = taskShape.businessObject;

        // when
        applyTemplate(taskShape, null);

        var connector = findExtension(taskShape, 'activiti:Connector');
        var inputOutput = connector.get('inputOutput');

        // then
        expect(task.get('activiti:modelerTemplate')).not.to.exist;

        // removing a task template does
        // not change the applied values
        expect(connector).to.exist;

        expect(inputOutput.inputParameters).to.jsonEqual([
          {
            $type: 'activiti:InputParameter',
            name: 'method',
            value: 'GET'
          },
          {
            $type: 'activiti:InputParameter',
            name: 'url',
            value: 'https://bpmn.io'
          }
        ]);

        expect(inputOutput.outputParameters).to.jsonEqual([
          {
            $type: 'activiti:OutputParameter',
            name: 'wsResponse',
            definition: {
              $type: 'activiti:Script',
              scriptFormat: 'freemarker',
              value: '${S(response)}'
            }
          }
        ]);
      }));


      it('undo', inject(function(elementRegistry, commandStack) {

        // given
        var taskShape = elementRegistry.get('Task_1'),
            task = taskShape.businessObject;

        applyTemplate(taskShape, null);


        // when
        commandStack.undo();

        var connector = findExtension(taskShape, 'activiti:Connector');
        var inputOutput = connector.get('inputOutput');

        // then
        expect(task.get('activiti:modelerTemplate')).to.eql(currentTemplate.id);

        expect(connector).to.exist;
        expect(inputOutput).to.exist;
      }));

    });

  });


  describe('should change element template', function() {

    describe('setting activiti:class', function() {

      var diagramXML = require('./serviceTask-camunda-class.bpmn');

      var newTemplate = require('./serviceTask-delegateExpression');

      beforeEach(bootstrapModeler(diagramXML, {
        container: container,
        modules: [
          coreModule,
          modelingModule,
          propertiesPanelCommandsModule,
          elementTemplatesModule
        ],
        moddleExtensions: {
          activiti: activitiModdlePackage
        }
      }));


      it('execute', inject(function(elementRegistry) {

        // given
        var taskShape = elementRegistry.get('ServiceTask_1'),
            task = taskShape.businessObject;

        // assume
        expect(task.get('activiti:class')).to.eql('FOO');

        // when
        applyTemplate(taskShape, newTemplate);

        var camundaCls = task.get('activiti:class');
        var camundaDelegateExpr = task.get('activiti:delegateExpression');

        // then
        expect(camundaCls).not.to.exist;
        expect(camundaDelegateExpr).to.eql('com.my.custom.Foo');
      }));


      it('undo', inject(function(elementRegistry, commandStack) {

        // given
        var taskShape = elementRegistry.get('ServiceTask_1'),
            task = taskShape.businessObject;

        applyTemplate(taskShape, newTemplate);


        // when
        commandStack.undo();

        var camundaCls = task.get('activiti:class');
        var camundaDelegateExpr = task.get('activiti:delegateExpression');

        // then
        expect(camundaCls).to.eql('FOO');
        expect(camundaDelegateExpr).not.to.exist;
      }));

    });


    describe('setting hidden activiti:expression', function() {

      var diagramXML = require('./task-clean.bpmn');

      var newTemplate = require('./ws-properties');

      beforeEach(bootstrapModeler(diagramXML, {
        container: container,
        modules: [
          coreModule,
          modelingModule,
          propertiesPanelCommandsModule,
          elementTemplatesModule
        ],
        moddleExtensions: {
          activiti: activitiModdlePackage
        }
      }));


      it('execute', inject(function(elementRegistry) {

        // given
        var taskShape = elementRegistry.get('Task_1'),
            task = taskShape.businessObject;

        // when
        applyTemplate(taskShape, newTemplate);

        var camundaExpression = task.get('activiti:expression');

        // then
        expect(camundaExpression).to.eql('${ wsCaller.exec() }');
      }));


      it('undo', inject(function(elementRegistry, commandStack) {

        // given
        var taskShape = elementRegistry.get('Task_1'),
            task = taskShape.businessObject;

        applyTemplate(taskShape, newTemplate);

        // when
        commandStack.undo();

        var camundaExpression = task.get('activiti:expression');

        // then
        expect(camundaExpression).not.to.exist;
      }));

    });


    describe('setting activiti:inputOutput', function() {

      var diagramXML = require('./task-custom-mappings.bpmn');

      var newTemplate = require('./mail-task');

      beforeEach(bootstrapModeler(diagramXML, {
        container: container,
        modules: [
          coreModule,
          modelingModule,
          propertiesPanelCommandsModule,
          elementTemplatesModule
        ],
        moddleExtensions: {
          activiti: activitiModdlePackage
        }
      }));


      it('execute', inject(function(elementRegistry) {

        // given
        var taskShape = elementRegistry.get('Task_1');
        var oldMappings = findExtension(taskShape, 'activiti:InputOutput');

        // assume
        expect(oldMappings).to.exist;

        // when
        applyTemplate(taskShape, newTemplate);

        var inputOutput = findExtension(taskShape, 'activiti:InputOutput');

        // then
        expect(inputOutput).to.exist;
        expect(inputOutput).not.to.eql(oldMappings);
      }));


      it('undo', inject(function(elementRegistry, commandStack) {

        // given
        var taskShape = elementRegistry.get('Task_1');
        var oldMappings = findExtension(taskShape, 'activiti:InputOutput');

        applyTemplate(taskShape, newTemplate);


        // when
        commandStack.undo();

        var currentMappings = findExtension(taskShape, 'activiti:InputOutput');

        // then
        expect(currentMappings).to.eql(oldMappings);
      }));

    });


    describe('setting activiti:properties', function() {

      var diagramXML = require('./task-custom-properties.bpmn');

      var newTemplate = require('./ws-properties');

      beforeEach(bootstrapModeler(diagramXML, {
        container: container,
        modules: [
          coreModule,
          modelingModule,
          propertiesPanelCommandsModule,
          elementTemplatesModule
        ],
        moddleExtensions: {
          activiti: activitiModdlePackage
        }
      }));


      it('execute', inject(function(elementRegistry) {

        // given
        var taskShape = elementRegistry.get('Task_1');

        // when
        applyTemplate(taskShape, newTemplate);

        var properties = findExtension(taskShape, 'activiti:Properties');

        // then
        expect(properties).to.exist;

        expect(properties.values).to.jsonEqual([
          {
            $type: 'activiti:Property',
            name: 'webServiceUrl',
            value: ''
          }
        ]);
      }));


      it('undo', inject(function(elementRegistry, commandStack) {

        // given
        var taskShape = elementRegistry.get('Task_1');

        applyTemplate(taskShape, newTemplate);


        // when
        commandStack.undo();

        var properties = findExtension(taskShape, 'activiti:Properties');

        // then
        expect(properties).to.exist;


        expect(properties.values).to.jsonEqual([
          {
            $type: 'activiti:Property',
            name: 'foo',
            value: 'FOO'
          },
          {
            $type: 'activiti:Property',
            name: 'bar',
            value: 'BAR'
          }
        ]);
      }));

    });

    describe('setting scope connector', function() {

      var diagramXML = require('./task-custom-connector.bpmn');

      var newTemplate = require('./connector-task');

      beforeEach(bootstrapModeler(diagramXML, {
        container: container,
        modules: [
          coreModule,
          modelingModule,
          propertiesPanelCommandsModule,
          elementTemplatesModule
        ],
        moddleExtensions: {
          activiti: activitiModdlePackage
        }
      }));


      it('execute', inject(function(elementRegistry) {

        // given
        var taskShape = elementRegistry.get('Task_1');
        var oldConnector = findExtension(taskShape, 'activiti:Connector');
        var oldMappings = oldConnector.get('inputOutput');

        // assume
        expect(oldConnector).to.exist;
        expect(oldMappings).to.exist;

        expect(oldConnector.get('connectorId')).to.equal('My Connector HTTP - POST');

        // when
        applyTemplate(taskShape, newTemplate);

        var connector = findExtension(taskShape, 'activiti:Connector');
        var inputOutput = connector.get('inputOutput');

        // then
        expect(connector).to.exist;
        expect(inputOutput).to.exist;
        expect(inputOutput).not.to.eql(oldMappings);

        expect(connector.get('connectorId')).to.equal('My Connector HTTP - GET');
      }));


      it('undo', inject(function(elementRegistry, commandStack) {

        // given
        var taskShape = elementRegistry.get('Task_1');
        var oldConnector = findExtension(taskShape, 'activiti:Connector');
        var oldMappings = oldConnector.get('inputOutput');

        // assume
        expect(oldConnector.get('connectorId')).to.equal('My Connector HTTP - POST');

        applyTemplate(taskShape, newTemplate);

        // when
        commandStack.undo();


        var connector = findExtension(taskShape, 'activiti:Connector');
        var currentMappings = connector.get('inputOutput');

        // then
        expect(connector.get('connectorId')).to.equal('My Connector HTTP - POST');
        expect(currentMappings).to.eql(oldMappings);
      }));

    });


  });
});



// test helpers /////////////////////////////////////

function applyTemplate(element, newTemplate, oldTemplate) {

  return TestHelper.getBpmnJS().invoke(function(elementRegistry, commandStack) {

    return commandStack.execute('propertiesPanel.camunda.changeTemplate', {
      element: element,
      newTemplate: newTemplate,
      oldTemplate: oldTemplate
    });

  });
}
