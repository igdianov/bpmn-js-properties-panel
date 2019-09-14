# Activiti bpmn-js-properties-panel

[![Build Status](https://travis-ci.org/igdianov/bpmn-js-properties-panel.svg?branch=master)](https://travis-ci.org/igdianov/bpmn-js-properties-panel)

A properties panel extension for [bpmn-js](https://github.com/bpmn-io/bpmn-js) that adds the ability to edit technical properties (generic and [Activiti](https://activiti.org)).

[![bpmn-js-properties-panel screenshot](https://raw.githubusercontent.com/bpmn-io/bpmn-js-properties-panel/master/docs/screenshot.png "Screenshot of the bpmn-js modeler + properties panel")](https://github.com/bpmn-io/bpmn-js-examples/tree/master/properties-panel)


## Features

The properties panel allows users to edit invisible BPMN properties in a convenient way.

Some of the features are:

* Edit element ids, multi-instance details and more
* Edit execution related [Activiti](https://activiti.org) properties
* Redo and undo (plugs into the [bpmn-js](https://github.com/bpmn-io/bpmn-js) editing cycle)

## Usage

Provide two HTML elements, one for the properties panel and one for the BPMN diagram:

```html
<div class="modeler">
  <div id="canvas"></div>
  <div id="properties"></div>
</div>
```

Bootstrap [bpmn-js](https://github.com/bpmn-io/bpmn-js) with the properties panel and a [properties provider](https://github.com/bpmn-io/bpmn-js-properties-panel/tree/master/lib/provider):

```javascript
var BpmnJS = require('bpmn-js/lib/Modeler'),
    propertiesPanelModule = require('bpmn-js-properties-panel'),
    propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/bpmn');

var bpmnJS = new BpmnJS({
  additionalModules: [
    propertiesPanelModule,
    propertiesProviderModule
  ],
  container: '#canvas',
  propertiesPanel: {
    parent: '#properties'
  }
});
```


### Dynamic Attach/Detach

You may attach or detach the properties panel dynamically to any element on the page, too:

```javascript
var propertiesPanel = bpmnJS.get('propertiesPanel');

// detach the panel
propertiesPanel.detach();

// attach it to some other element
propertiesPanel.attachTo('#other-properties');
```


### Use with Activiti properties

In order to be able to edit [Activiti](https://Activiti.org) related properties, use the [activiti properties provider](https://github.com/igdianov/bpmn-js-properties-panel/tree/master/lib/provider/activiti).
In addition, you need to define the `activiti` namespace via [activiti-bpmn-moddle](https://github.com/igdianov/activiti-bpmn-moddle).

```javascript
var BpmnJS = require('bpmn-js/lib/Modeler'),
    propertiesPanelModule = require('bpmn-js-properties-panel'),
    // use Activiti properties provider
    propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/activiti');

// a descriptor that defines Activiti related BPMN 2.0 XML extensions
var activitiModdleDescriptor = require('activiti-bpmn-moddle/resources/activiti');

var bpmnJS = new BpmnJS({
  additionalModules: [
    propertiesPanelModule,
    propertiesProviderModule
  ],
  container: '#canvas',
  propertiesPanel: {
    parent: '#properties'
  },
  // make activiti prefix known for import, editing and export
  moddleExtensions: {
    activiti: activitiModdleDescriptor
  }
});

...
```


## Additional Resources

* [Issue tracker](https://github.com/bpmn-io/bpmn-js-properties-panel)
* [Forum](https://forum.bpmn.io)
* [Example Project](https://github.com/bpmn-io/bpmn-js-examples/tree/master/properties-panel)


## Development

### Running the tests

```bash
npm install

export TEST_BROWSERS=Chrome
npm run all
```


## License

MIT
