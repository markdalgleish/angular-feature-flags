[![Build Status](https://travis-ci.org/mjt01/angular-feature-flags.png?branch=master)](https://travis-ci.org/mjt01/angular-feature-flags)
[![Coverage Status](https://coveralls.io/repos/mjt01/angular-feature-flags/badge.png)](https://coveralls.io/r/mjt01/angular-feature-flags)
## angular-feature-flags

An AngularJS module that allows you to control when you release new features in your app by putting them behind feature flags/switches.


### The idea

Abstracting your application functionality into small chunks and implementing them as loosely coupled directives. This allows you to completely remove sections of your application by simply toggling a single dom element.


### How it works

The basic premise is you write your feature and wrap it up in a directive, then where you implement that directive in your markup you add the **feature-flag** directive to the same element. You can then pass the **key** of the flag to this directive to resolve whether of not this feature should be enabled.

The module pulls a json file down which defines the feature flags and which ones are active. If enabled angular will process the directive as normal, if disabled angular will remove the element from the dom.

You can then add the **override** panel to your app and turn individual features on override the server values, saving the override in local storage which is useful in development.


### Flag data

The flag data that drives the feature flag service is a json format. Below is an example:
```json
[
    { "key": "...", "active": "...", "name": "...", "description": "..." },
    ...
]
```
<table>
   <tr>
    <td><b>key</b></td>
    <td>Unique key that is used from the markup to resolve whether a flag is active or not.</td>
   </tr>
   <tr>
    <td><b>active</b></td>
    <td>Boolean value for enabling/disabling the feature</td>
   </tr>
   <tr>
    <td><b>name</b></td>
    <td>A short name of the flag (only visible in the list of flags)</td>
   </tr>
   <tr>
    <td><b>description</b></td>
    <td>A long description of the flag to further explain the feature being toggled (only visible in the list of flags)</td>
   </tr>
</table>


### Configuration

<table>
  <tr>
    <td><b>FLAGS_URL</b></td>
    <td>A url or relative file path to retrieve the json file containing all the available feature flags. Configure this as a value on your module to override the default provided</td>
  </tr>
</table>


### Running the demo

Running the demo is easy assuming you have Gulp installed:

- Checkout the project
- Switch to the directory
- Run 'gulp demo'

Should launch the demo in your default browser


### Running the unit test

This relies on Gulp also obviously, to run the test suite:

- Checkout the project
- Switch to the directory
- Run 'gulp test'
