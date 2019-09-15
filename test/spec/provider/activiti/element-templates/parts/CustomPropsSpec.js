'use strict';

var TestHelper = require('../../../../../TestHelper');

/* global inject */

var findExtension = require('lib/provider/activiti/element-templates/Helper').findExtension,
    findExtensions = require('lib/provider/activiti/element-templates/Helper').findExtensions,
    findCamundaInOut = require('lib/provider/activiti/element-templates/Helper').findCamundaInOut,
    findInputParameter = require('lib/provider/activiti/element-templates/Helper').findInputParameter,
    findOutputParameter = require('lib/provider/activiti/element-templates/Helper').findOutputParameter,
    findCamundaProperty = require('lib/provider/activiti/element-templates/Helper').findCamundaProperty;

var entrySelect = require('./Helper').entrySelect,
    selectAndGet = require('./Helper').selectAndGet,
    bootstrap = require('./Helper').bootstrap;


describe('element-templates/parts - Custom Properties', function() {

  describe('bindings', function() {

    var diagramXML = require('./CustomProps.bpmn'),
        elementTemplates = require('./CustomProps.json');

    beforeEach(bootstrap(diagramXML, elementTemplates));


    describe('property', function() {

      it('should display', inject(function() {

        // given
        selectAndGet('AsyncTask');

        // when
        var awesomeEntry = entrySelect('custom-my.awesome.Task-0'),
            checkbox = entrySelect('custom-my.awesome.Task-0', '[type=checkbox]');

        // then
        expect(awesomeEntry).to.exist;
        expect(checkbox).to.exist;
      }));


      it('should change, updating Boolean property', inject(function() {

        // given
        var task = selectAndGet('AsyncTask');

        var checkbox = entrySelect('custom-my.awesome.Task-0', '[type=checkbox]');

        // when
        // trigger click on the checkbox
        TestHelper.triggerEvent(checkbox, 'click');

        // then
        expect(task.get('activiti:async')).to.be.false;
      }));


      it('should change, updating String property');

    });


    describe('activiti:property', function() {

      it('should display', inject(function() {

        // given
        selectAndGet('WebserviceTask');

        // when
        var endpointEntry = entrySelect('custom-com.mycompany.WsCaller-0'),
            textField = entrySelect('custom-com.mycompany.WsCaller-0', 'input');

        // then
        expect(endpointEntry).to.exist;
        expect(textField).to.exist;
      }));


      it('should change, updating activiti:Property', inject(function() {

        // given
        var task = selectAndGet('WebserviceTask');

        var textField = entrySelect('custom-com.mycompany.WsCaller-0', 'input');

        // when
        TestHelper.triggerValue(textField, 'https://baba', 'change');

        var camundaProperties = findExtension(task, 'activiti:Properties'),
            wsProperty = findCamundaProperty(camundaProperties, { name: 'webServiceUrl' });

        // then
        expect(wsProperty).to.exist;
        expect(wsProperty.value).to.eql('https://baba');
      }));


      it('should change, creating activiti:Property if non-existing', inject(function() {

        // given
        var task = selectAndGet('WebserviceTask_NoData');

        var textField = entrySelect('custom-com.mycompany.WsCaller-0', 'input');

        // when
        TestHelper.triggerValue(textField, 'https://baba', 'change');

        var camundaProperties = findExtension(task, 'activiti:Properties'),
            wsProperty = findCamundaProperty(camundaProperties, { name: 'webServiceUrl' });

        // then
        expect(wsProperty).to.exist;
        expect(wsProperty.value).to.eql('https://baba');
      }));

    });


    describe('activiti:inputParameter', function() {

      it('should display', inject(function() {

        // given
        selectAndGet('MailTask');

        // when
        var recipientField = entrySelect('custom-my.mail.Task-0', 'input'),
            templateField = entrySelect('custom-my.mail.Task-1', 'div[contenteditable]');

        // then
        expect(recipientField).to.exist;
        expect(templateField).to.exist;
      }));


      it('should hide if type=Hidden', inject(function() {

        // given
        selectAndGet('MailTask');

        // when
        var hiddenField = entrySelect('custom-my.mail.Task-3', '*');

        // then
        expect(hiddenField).not.to.exist;
      }));


      it('should change, setting activiti:InputParameter (plain)', inject(function() {

        // given
        var task = selectAndGet('MailTask');

        var recipientField = entrySelect('custom-my.mail.Task-0', 'input');

        // when
        TestHelper.triggerValue(recipientField, 'foo@bar', 'change');

        var inputOutput = findExtension(task, 'activiti:InputOutput'),
            recipientMapping = findInputParameter(inputOutput, { name: 'recipient' });

        // then
        expect(recipientMapping).to.exist;
        expect(recipientMapping).to.jsonEqual({
          $type: 'activiti:InputParameter',
          name: 'recipient',
          value: 'foo@bar'
        });
      }));


      it('should change, setting activiti:InputParameter (script)', inject(function() {

        // given
        var task = selectAndGet('MailTask');

        var templateField = entrySelect('custom-my.mail.Task-1', 'div[contenteditable]');

        // when
        TestHelper.triggerValue(templateField, 'Hello ${foo}', 'change');

        var inputOutput = findExtension(task, 'activiti:InputOutput'),
            recipientMapping = findInputParameter(inputOutput, { name: 'messageBody' });

        // then
        expect(recipientMapping).to.exist;

        expect(recipientMapping).to.jsonEqual({
          $type: 'activiti:InputParameter',
          name: 'messageBody',
          definition: {
            $type: 'activiti:Script',
            scriptFormat: 'freemarker',
            value: 'Hello ${foo}'
          }
        });
      }));


      it('should change, creating activiti:InputParameter if non-existing', inject(function() {

        // given
        var task = selectAndGet('MailTask_NoData');

        var recipientField = entrySelect('custom-my.mail.Task-0', 'input');

        // when
        TestHelper.triggerValue(recipientField, 'foo@bar', 'change');

        var inputOutput = findExtension(task, 'activiti:InputOutput'),
            recipientMapping = findInputParameter(inputOutput, { name: 'recipient' });

        // then
        expect(recipientMapping).to.exist;
        expect(recipientMapping).to.jsonEqual({
          $type: 'activiti:InputParameter',
          name: 'recipient',
          value: 'foo@bar'
        });
      }));

    });


    describe('activiti:outputParameter', function() {

      it('should display', inject(function() {

        // given
        selectAndGet('MailTask');

        // when
        var resultField = entrySelect('custom-my.mail.Task-2', 'input');

        // then
        expect(resultField).to.exist;
      }));


      it('should change, setting activiti:OutputParameter (plain)');


      it('should change, setting activiti:OutputParameter (script)', inject(function() {

        // given
        var task = selectAndGet('MailTask');

        // when
        var resultField = entrySelect('custom-my.mail.Task-2', 'input');

        // when
        TestHelper.triggerValue(resultField, 'result', 'change');

        var inputOutput = findExtension(task, 'activiti:InputOutput'),
            resultMapping = findOutputParameter(inputOutput, {
              source: '${mailResult}',
              scriptFormat: 'freemarker'
            });

        // then
        expect(resultMapping).to.exist;
        expect(resultMapping).to.jsonEqual({
          $type: 'activiti:OutputParameter',
          name: 'result',
          definition: {
            $type: 'activiti:Script',
            scriptFormat: 'freemarker',
            value: '${mailResult}'
          }
        });
      }));


      it('should change, creating activiti:OutputParameter if non-existing', inject(function() {

        // given
        var task = selectAndGet('MailTask_NoData');

        // when
        var resultField = entrySelect('custom-my.mail.Task-2', 'input');

        // when
        TestHelper.triggerValue(resultField, 'result', 'change');

        var inputOutput = findExtension(task, 'activiti:InputOutput'),
            resultMapping = findOutputParameter(inputOutput, {
              source: '${mailResult}',
              scriptFormat: 'freemarker'
            });

        // then
        expect(resultMapping).to.exist;
        expect(resultMapping).to.jsonEqual({
          $type: 'activiti:OutputParameter',
          name: 'result',
          definition: {
            $type: 'activiti:Script',
            scriptFormat: 'freemarker',
            value: '${mailResult}'
          }
        });
      }));

    });


    describe('activiti:in', function() {

      it('should display', inject(function() {

        // given
        selectAndGet('CallActivity');

        // when
        var resultField = entrySelect('custom-my.Caller-1', 'input');

        // then
        expect(resultField).to.exist;
      }));


      it('should change, setting activiti:in (source)', inject(function() {

        // given
        var task = selectAndGet('CallActivity');

        // when
        var resultField = entrySelect('custom-my.Caller-1', 'input');

        // when
        TestHelper.triggerValue(resultField, 'result', 'change');

        var camundaIn = findCamundaInOut(task, {
          type: 'activiti:in',
          target: 'var_called_source'
        });

        expect(camundaIn).to.jsonEqual({
          $type: 'activiti:In',
          target: 'var_called_source',
          source: 'result'
        });
      }));


      it('should change, setting activiti:in:businessKey', inject(function() {

        // given
        var task = selectAndGet('CallActivity');

        // when
        var resultField = entrySelect('custom-my.Caller-9', 'input');

        // when
        TestHelper.triggerValue(resultField, '${key}', 'change');

        var camundaIn = findCamundaInOut(task, {
          type: 'activiti:in:businessKey'
        });

        expect(camundaIn).to.jsonEqual({
          $type: 'activiti:In',
          businessKey: '${key}'
        });
      }));


      it('should change, setting activiti:in (sourceExpression)', inject(function() {

        // given
        var task = selectAndGet('CallActivity');

        // when
        var resultField = entrySelect('custom-my.Caller-3', 'input');

        // when
        TestHelper.triggerValue(resultField, '${expr_foo}', 'change');

        var camundaIn = findCamundaInOut(task, {
          type: 'activiti:in',
          target: 'var_called_expr'
        });

        expect(camundaIn).to.jsonEqual({
          $type: 'activiti:In',
          target: 'var_called_expr',
          sourceExpression: '${expr_foo}'
        });
      }));


      it('should change, creating activiti:in if non-existing', inject(function() {

        // given
        var task = selectAndGet('CallActivity_NoData');

        // when
        var resultField = entrySelect('custom-my.Caller-3', 'input');

        // when
        TestHelper.triggerValue(resultField, '${expr_foo}', 'change');

        var camundaIn = findCamundaInOut(task, {
          type: 'activiti:in',
          target: 'var_called_expr'
        });

        expect(camundaIn).to.jsonEqual({
          $type: 'activiti:In',
          target: 'var_called_expr',
          sourceExpression: '${expr_foo}'
        });
      }));

    });


    describe('activiti:out', function() {

      it('should display', inject(function() {

        // given
        selectAndGet('CallActivity');

        // when
        var resultField = entrySelect('custom-my.Caller-2', 'input');

        // then
        expect(resultField).to.exist;
      }));


      it('should change, setting activiti:out (source)', inject(function() {

        // given
        var task = selectAndGet('CallActivity');

        // when
        var resultField = entrySelect('custom-my.Caller-2', 'input');

        // when
        TestHelper.triggerValue(resultField, 'result', 'change');

        var camundaOut = findCamundaInOut(task, {
          type: 'activiti:out',
          source: 'var_local_source'
        });

        expect(camundaOut).to.jsonEqual({
          $type: 'activiti:Out',
          target: 'result',
          source: 'var_local_source'
        });
      }));


      it('should change, setting activiti:out (sourceExpression)', inject(function() {

        // given
        var task = selectAndGet('CallActivity');

        // when
        var resultField = entrySelect('custom-my.Caller-4', 'input');

        // when
        TestHelper.triggerValue(resultField, 'local_foo', 'change');

        var camundaOut = findCamundaInOut(task, {
          type: 'activiti:out',
          sourceExpression: '${expr_called}'
        });

        expect(camundaOut).to.jsonEqual({
          $type: 'activiti:Out',
          target: 'local_foo',
          sourceExpression: '${expr_called}'
        });
      }));


      it('should change, creating activiti:out if non-existing', inject(function() {

        // given
        var task = selectAndGet('CallActivity_NoData');

        // when
        var resultField = entrySelect('custom-my.Caller-4', 'input');

        // when
        TestHelper.triggerValue(resultField, 'local_foo', 'change');

        var camundaOut = findCamundaInOut(task, {
          type: 'activiti:out',
          sourceExpression: '${expr_called}'
        });

        expect(camundaOut).to.jsonEqual({
          $type: 'activiti:Out',
          target: 'local_foo',
          sourceExpression: '${expr_called}'
        });
      }));

    });


    describe('activiti:executionListener', function() {

      it('should hide', inject(function() {

        // given
        selectAndGet('ExecutionListenerTask');

        // when
        var hiddenField = entrySelect('custom-my.execution.listener.task-0', '*');

        // then
        expect(hiddenField).not.to.exist;
      }));

    });


    describe('activiti:field', function() {

      it('should display', inject(function() {

        // given
        selectAndGet('ServiceTask_FieldInjection');

        // when
        var endpointEntry = entrySelect('custom-com.camunda.example.CustomServiceTaskFieldInjection-0'),
            textField = entrySelect('custom-com.camunda.example.CustomServiceTaskFieldInjection-0', 'input');

        // then
        expect(endpointEntry).to.exist;
        expect(textField).to.exist;
      }));


      it('should change, updating activiti:field', inject(function() {

        // given
        var task = selectAndGet('ServiceTask_FieldInjection');

        var textField = entrySelect('custom-com.camunda.example.CustomServiceTaskFieldInjection-0', 'input');

        // when
        TestHelper.triggerValue(textField, 'https://baba', 'change');

        var fieldInjections = findExtensions(task, [ 'activiti:Field' ]);

        // then
        expect(fieldInjections).to.exist;
        expect(fieldInjections).to.jsonEqual([
          {
            $type: 'activiti:Field',
            string: 'https://baba',
            name: 'sender'
          },
          {
            $type: 'activiti:Field',
            name: 'sender2',
            string: 'buhh1'
          }
        ]);
      }));


      it('should change, creating activiti:field if non-existing', inject(function() {

        // given
        var task = selectAndGet('ServiceTask_FieldInjection_NoData');

        var textField = entrySelect('custom-com.camunda.example.CustomServiceTaskFieldInjection-0', 'input');

        // when
        TestHelper.triggerValue(textField, 'https://baba', 'change');

        var fieldInjections = findExtensions(task, [ 'activiti:Field' ]);

        // then
        expect(fieldInjections).to.exist;
        expect(fieldInjections).to.jsonEqual([
          {
            $type: 'activiti:Field',
            string: 'https://baba',
            name: 'sender'
          }
        ]);
      }));

    });


    describe('activiti:Connector', function() {

      function expectError(entry, message) {
        var errorElement = entrySelect(entry, '.bpp-error-message');

        var error = errorElement && errorElement.textContent;

        expect(error).to.eql(message);
      }

      function expectValid(entry) {
        expectError(entry, null);
      }

      function changeInput(entry, newValue) {
        var input = entrySelect(entry, 'input');

        TestHelper.triggerValue(input, newValue, 'change');
      }


      describe('connector', function() {

        it('should exist', inject(function() {

          // given
          var task = selectAndGet('ConnectorTask');
          var connector = findExtension(task, 'activiti:Connector');

          expect(connector).to.exist;
        }));

      });


      describe('property', function() {

        it('should display', inject(function() {

          // given
          selectAndGet('ConnectorTask');

          // when
          var connectorIdEntry = entrySelect('custom-my.connector.Task-activiti_Connector-0'),
              inputText = entrySelect('custom-my.connector.Task-activiti_Connector-0', '[type=text]');

          // then
          expect(connectorIdEntry).to.exist;
          expect(inputText).to.exist;
        }));


        it('should change, updating String property', inject(function() {

          // given
          selectAndGet('ConnectorTask');

          var entryId = 'custom-my.connector.Task-activiti_Connector-0';
          var inputText = entrySelect(entryId, '[type=text]');

          // assume
          expectValid(entryId);
          expect(inputText.value).to.equal('My Connector HTTP');

          // when
          changeInput(entryId, '');

          // then
          expect(inputText.value).to.equal('');
          expectError(entryId, 'Must not be empty');
        }));

      });


      describe('activiti:inputParameter', function() {

        it('should display', inject(function() {

          // given
          selectAndGet('ConnectorTask');

          // when
          var entryId = 'custom-my.connector.Task-activiti_Connector-1';
          var inputText = entrySelect(entryId, '[type=text]');

          // assume
          expect(inputText.value).to.equal('');
          expectError(entryId, 'Must not be empty');

          // when
          changeInput(entryId, 'http://camunda-modeler/');

          // then
          expectValid(entryId);
          expect(inputText.value).to.equal('http://camunda-modeler/');
        }));


        it('should hide if type=Hidden', inject(function() {

          // given
          selectAndGet('ConnectorTask');

          // when
          var entryId = 'custom-my.connector.Task-activiti_Connector-3';
          var hiddenField = entrySelect(entryId, '*');

          // then
          expect(hiddenField).not.to.exist;
        }));


        it('should change, setting activiti:InputParameter (plain)', inject(function() {

          // given
          var task = selectAndGet('ConnectorTask');

          var entryId = 'custom-my.connector.Task-activiti_Connector-1';
          var urlField = entrySelect(entryId, 'input');

          // when
          TestHelper.triggerValue(urlField, 'http://camunda-modeler/', 'change');

          var connector = findExtension(task, 'activiti:Connector'),
              inputOutput = connector.get('inputOutput'),
              urlMapping = findInputParameter(inputOutput, { name: 'url' });

          // then
          expect(urlMapping).to.exist;
          expect(urlMapping).to.jsonEqual({
            $type: 'activiti:InputParameter',
            name: 'url',
            value: 'http://camunda-modeler/'
          });
        }));


        it('should change, setting activiti:InputParameter (script)', inject(function() {

          // given
          var task = selectAndGet('ConnectorTask');

          var entryId = 'custom-my.connector.Task-activiti_Connector-4';
          var templateField = entrySelect(entryId, 'div[contenteditable]');

          // when
          TestHelper.triggerValue(templateField, 'Hello ${foo}', 'change');

          var connector = findExtension(task, 'activiti:Connector'),
              inputOutput = connector.get('inputOutput'),
              recipientMapping = findInputParameter(inputOutput, { name: 'messageBody' });

          // then
          expect(recipientMapping).to.exist;

          expect(recipientMapping).to.jsonEqual({
            $type: 'activiti:InputParameter',
            name: 'messageBody',
            definition: {
              $type: 'activiti:Script',
              scriptFormat: 'freemarker',
              value: 'Hello ${foo}'
            }
          });
        }));


        it('should change, setting activiti:InputParameter (Dropdown)', inject(function() {

          // given
          var task = selectAndGet('ConnectorTask');

          var entryId = 'custom-my.connector.Task-activiti_Connector-2';
          var recipientField = entrySelect(entryId, 'select');

          // assume
          expect(recipientField.value).to.equal('');
          expectError(entryId, 'Must not be empty');

          // when
          TestHelper.triggerValue(recipientField, 'POST', 'change');

          // then
          expectValid(entryId);
          expect(recipientField.value).to.equal('POST');

          var connector = findExtension(task, 'activiti:Connector'),
              inputOutput = connector.get('inputOutput'),
              recipientMapping = findInputParameter(inputOutput, { name: 'method' });

          expect(recipientMapping).to.exist;
          expect(recipientMapping).to.jsonEqual({
            $type: 'activiti:InputParameter',
            name: 'method',
            value: 'POST'
          });
        }));


        it('should change, creating activiti:InputParameter if non-existing', inject(function() {

          // given
          var task = selectAndGet('ConnectorTask_NoData');

          var entryId = 'custom-my.connector.Task-activiti_Connector-1';
          var recipientField = entrySelect(entryId, 'input');

          // assume
          expect(recipientField.value).to.equal('');
          expectError(entryId, 'Must not be empty');

          // when
          TestHelper.triggerValue(recipientField, 'http://camunda-modeler/', 'change');

          // then
          expectValid(entryId);
          expect(recipientField.value).to.equal('http://camunda-modeler/');

          var connector = findExtension(task, 'activiti:Connector'),
              inputOutput = connector.get('inputOutput'),
              recipientMapping = findInputParameter(inputOutput, { name: 'url' });

          expect(recipientMapping).to.exist;
          expect(recipientMapping).to.jsonEqual({
            $type: 'activiti:InputParameter',
            name: 'url',
            value: 'http://camunda-modeler/'
          });
        }));

      });


      describe('activiti:outputParameter', function() {

        it('should display', inject(function() {

          // given
          selectAndGet('ConnectorTask');

          var entryId = 'custom-my.connector.Task-activiti_Connector-5';
          var responseField = entrySelect(entryId, 'input');

          // then
          expect(responseField).to.exist;
        }));


        it('should change, setting activiti:OutputParameter (plain)', inject(function() {
          // given
          var task = selectAndGet('ConnectorTask');

          // when
          var entryId = 'custom-my.connector.Task-activiti_Connector-5';
          var responseField = entrySelect(entryId, 'input');

          // when
          TestHelper.triggerValue(responseField, 'result', 'change');

          var connector = findExtension(task, 'activiti:Connector'),
              inputOutput = connector.get('inputOutput'),
              recipientMapping = findOutputParameter(inputOutput, { source: 'wsResponse' });

          expect(recipientMapping).to.exist;
          expect(recipientMapping).to.jsonEqual({
            $type: 'activiti:OutputParameter',
            name: 'result',
            value: 'wsResponse'
          });
        }));


        it('should change, setting activiti:OutputParameter (script)', inject(function() {

          // given
          var task = selectAndGet('ConnectorTask');

          // when
          var entryId = 'custom-my.connector.Task-activiti_Connector-6';
          var resultField = entrySelect(entryId, 'input');

          // when
          TestHelper.triggerValue(resultField, 'result', 'change');

          var connector = findExtension(task, 'activiti:Connector'),
              inputOutput = connector.get('inputOutput'),
              resultMapping = findOutputParameter(inputOutput, {
                source: '${httpResult}',
                scriptFormat: 'freemarker'
              });

          // then
          expect(resultMapping).to.exist;
          expect(resultMapping).to.jsonEqual({
            $type: 'activiti:OutputParameter',
            name: 'result',
            definition: {
              $type: 'activiti:Script',
              scriptFormat: 'freemarker',
              value: '${httpResult}'
            }
          });
        }));


        it('should change, creating activiti:OutputParameter if non-existing', inject(function() {

          // given
          var task = selectAndGet('ConnectorTask_NoData');

          // when
          var entryId = 'custom-my.connector.Task-activiti_Connector-6';
          var resultField = entrySelect(entryId, 'input');

          // when
          TestHelper.triggerValue(resultField, 'result', 'change');

          var connector = findExtension(task, 'activiti:Connector'),
              inputOutput = connector.get('inputOutput'),
              resultMapping = findOutputParameter(inputOutput, {
                source: '${httpResult}',
                scriptFormat: 'freemarker'
              });

          // then
          expect(resultMapping).to.exist;
          expect(resultMapping).to.jsonEqual({
            $type: 'activiti:OutputParameter',
            name: 'result',
            definition: {
              $type: 'activiti:Script',
              scriptFormat: 'freemarker',
              value: '${httpResult}'
            }
          });
        }));

      });

    });

  });


  describe('types', function() {

    var diagramXML = require('./CustomProps.dropdown.bpmn'),
        elementTemplates = require('./CustomProps.json');

    beforeEach(bootstrap(diagramXML, elementTemplates));


    function getDropdownOptions(selector) {

      var options = entrySelect.all(selector, 'select option');

      return options.map(function(o) {
        return {
          value: o.value,
          selected: o.selected
        };
      });
    }

    function changeDropdown(selector, newValue) {

      var templateSelect = entrySelect(selector, 'select'),
          option = entrySelect(selector, 'option[value="' + newValue + '"]');

      option.selected = 'selected';

      TestHelper.triggerEvent(templateSelect, 'change');
    }


    it('should display options', inject(function() {

      // given
      selectAndGet('PriorityTask');

      // when
      var options = getDropdownOptions('custom-my.priority.Task-0');

      // then
      expect(options).to.eql([
        { value: '50', selected: true },
        { value: '100', selected: false },
        { value: '150', selected: false }
      ]);
    }));


    it('should change, updating binding', inject(function() {

      // given
      var task = selectAndGet('PriorityTask');

      // when
      changeDropdown('custom-my.priority.Task-0', '100');

      // then
      expect(task.get('activiti:priority')).to.eql('100');
    }));

  });


  describe('validation', function() {

    var diagramXML = require('./CustomProps.bpmn'),
        elementTemplates = require('./CustomProps.json');

    beforeEach(bootstrap(diagramXML, elementTemplates));

    function expectError(entry, message) {
      var errorElement = entrySelect(entry, '.bpp-error-message');

      var error = errorElement && errorElement.textContent;

      expect(error).to.eql(message);
    }

    function expectValid(entry) {
      expectError(entry, null);
    }

    function changeInput(entry, newValue) {
      var input = entrySelect(entry, 'input');

      TestHelper.triggerValue(input, newValue, 'change');
    }


    it('should validate nonEmpty', inject(function() {

      // given
      selectAndGet('ValidateTask');

      var entryId = 'custom-com.validated-inputs.Task-0';

      // assume
      expectError(entryId, 'Must not be empty');

      // when
      changeInput(entryId, 'FOO');

      // then
      expectValid(entryId);
    }));


    it('should validate minLength', inject(function() {

      // given
      selectAndGet('ValidateTask');

      var entryId = 'custom-com.validated-inputs.Task-1';

      // assume
      expectError(entryId, 'Must have min length 5');

      // when
      changeInput(entryId, 'FOOOOOOO');

      // then
      expectValid(entryId);
    }));


    it('should validate maxLength', inject(function() {

      // given
      selectAndGet('ValidateTask');

      var entryId = 'custom-com.validated-inputs.Task-2';

      // assume
      expectValid(entryId);

      // when
      changeInput(entryId, 'FOOOOOOO');

      // then
      expectError(entryId, 'Must have max length 5');
    }));


    it('should validate pattern (String)', inject(function() {

      // given
      selectAndGet('ValidateTask');

      var entryId = 'custom-com.validated-inputs.Task-3';

      // assume
      expectError(entryId, 'Must match pattern A+B');

      // when
      changeInput(entryId, 'AAAB');

      // then
      expectValid(entryId);
    }));


    it('should validate pattern (String + Message)', inject(function() {

      // given
      selectAndGet('ValidateTask');

      var entryId = 'custom-com.validated-inputs.Task-4';

      // assume
      expectError(entryId, 'Must start with https://');

      // when
      changeInput(entryId, 'https://');

      // then
      expectValid(entryId);
    }));


    it('should validate pattern (Integer)', inject(function() {

      // given
      selectAndGet('ValidateTask');

      var entryId = 'custom-com.validated-inputs.Task-5';

      // assume
      expectError(entryId, 'Must be positive integer');

      // when
      changeInput(entryId, '20');

      // then
      expectValid(entryId);
    }));

  });

});
