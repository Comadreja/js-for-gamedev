'use strict';

var EventEmitter = require('events').EventEmitter;

function Options(group) {
  EventEmitter.call(this);
  this._group = typeof group === 'object' ? group : {};
}
Options.prototype = Object.create(EventEmitter.prototype);
Options.prototype.constructor = Options;

Options.prototype.list = function () {
  return Object.keys(this._group);
};

Options.prototype.get = function (id) {
  return this._group[id];
};

Options.prototype.select = function (id) {
  // Make it so that an event is emitted when we select an option.
};

module.exports = Options;
